/*
  Action examples:
    - shop.user.registered
  Queue name examples
    - retention.send_welcome_email_on_user_registered
    - retention.create_retention_user_on_user_registered
    - security.update_last_activity_on_user_updated
*/

import { DomainEvent } from "#Domain/events/domain-event.js";

import type { connect, Channel, Options, ConsumeMessage, ChannelModel } from "amqplib";
import type { IEvent } from "#Domain/events/domain-event";
import type { SystemDemon } from "#Domain/SystemDemon";
import type { DomainEventBus } from "#Domain/events/DomainEventBus";
import type { IErrorHandler } from "#Domain/errors/IErrorHandler";
import type { ILogger } from "#Domain/core/ILogger";

interface Dependences {
	connect: typeof connect;
	queue: string;
	options: Options.Connect;
	logger: ILogger;
	eventBus: DomainEventBus;
	errorHandler: IErrorHandler;
}

export class RabbitMQConnection {
	#isRunning: boolean;
	readonly #connect: typeof connect;
	readonly #queue: string;
	readonly #options: Options.Connect;
	readonly #errorHandler: IErrorHandler;
	readonly #logger: ILogger;
	#conn: ChannelModel;
	#channel: Channel;

	constructor(d: Dependences) {
		this.#isRunning = false;
		this.#connect = d.connect;
		this.#queue = d.queue;
		this.#options = d.options;
		this.#errorHandler = d.errorHandler;
		this.#logger = d.logger;
	}

	get queueConnection(): SystemDemon {
		return {
			start: this.#start,
			stop: this.#stop,
			restart: this.#restart,
		};
	}

	readonly #start = async (): Promise<void> => {
		this.#conn = await this.#connect(this.#options);
		this.#channel = await this.#conn.createChannel();
		const assertQueue = await this.#channel.assertQueue(this.#queue, { durable: false });
		if (assertQueue === undefined) throw new Error("Problem in assertQueue");
		this.#channel.consume(this.#queue, this.#consume);
		this.#isRunning = true;
		return await Promise.resolve(this.#logger.info("Server connected"));
	};

	readonly #stop = async (): Promise<void> => {
		if (this.#isRunning === false) return;
		await this.#channel.close();
		await this.#conn.close();
		return await Promise.resolve(this.#logger.info("Queue server disconnected"));
	};

	readonly #restart = async (): Promise<void> => {
		if (this.#isRunning === false) return;
		this.#logger.info("Restarting");
		await this.#stop();
		return await Promise.resolve(this.#start());
	};

	readonly #consume = async (message: ConsumeMessage | null): Promise<void> => {
		if (message === null) return;
		try {
			const event: IEvent<object> = JSON.parse(message.content.toString());
			new DomainEvent(event).emit();
			return await Promise.resolve(this.#channel.ack(message));
		} catch (error) {
			if (error instanceof SyntaxError) this.#logger.warn("Problem consuming message: " + error.message);
			const exception = this.#errorHandler.catch({ name: this.constructor.name, ticket: message.properties.correlationId, error });
			if (exception.code === 422) this.#logger.error("External Event incompatible", exception.cause);
		}
	};

	public readonly publish = async <M extends object>(event: IEvent<M>): Promise<void> => {
		const buffer = Buffer.from(JSON.stringify(event));
		// this.channel.publish(exchange, routingKey, content);
		return this.#channel.sendToQueue(this.#queue, buffer /*, { persistent: true } */)
			? await Promise.resolve(this.#logger.info(`Event ${event.id} published in queue ${this.#queue}`))
			: await Promise.reject(this.#logger.error(`failed sending event ${event.id}`));
	};
}
