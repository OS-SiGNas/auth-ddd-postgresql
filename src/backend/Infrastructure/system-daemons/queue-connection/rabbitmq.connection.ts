/*
  Action examples:
    - shop.user.registered
  Queue name examples
    - retention.send_welcome_email_on_user_registered
    - retention.create_retention_user_on_user_registered
    - security.update_last_activity_on_user_updated
*/

import { ACTIONS } from "#Domain";
import type { connect, Channel, Options, ConsumeMessage, ChannelModel } from "amqplib";
import type { DomainEventBus, IErrorHandler, IEvent, ILogger, SystemDaemon } from "#Domain";

interface Dependencies {
	connect: typeof connect;
	queue: string;
	options: Options.Connect;
	logger: ILogger;
	bus: DomainEventBus;
	errorHandler: IErrorHandler;
}

export class RabbitMQConnection implements SystemDaemon {
	#isRunning: boolean;
	readonly #connect: typeof connect;
	readonly #queue: string;
	readonly #options: Options.Connect;
	readonly #bus: DomainEventBus;
	readonly #errorHandler: IErrorHandler;
	readonly #logger: ILogger;
	#connection: ChannelModel;
	#channel: Channel;

	constructor(d: Dependencies) {
		this.#isRunning = false;
		this.#connect = d.connect;
		this.#queue = d.queue;
		this.#options = d.options;
		this.#bus = d.bus.on(ACTIONS.QUEUE_PUBLISH, this.#publish);
		this.#errorHandler = d.errorHandler;
		this.#logger = d.logger;
	}

	public readonly start = async (): Promise<void> => {
		try {
			this.#logger.info("Starting queue connection");
			this.#connection = await this.#connect(this.#options);
			if (this.#connection !== undefined) this.#logger.info("Connection success");
			this.#channel = await this.#connection.createChannel();
			if (this.#channel !== undefined) this.#logger.info("Channel created");
			const assertQueue = await this.#channel.assertQueue(this.#queue, { durable: false });
			if (assertQueue === undefined) throw new Error("Problem in assertQueue");
			this.#channel.consume(this.#queue, this.#consume);
			this.#isRunning = true;
			return await Promise.resolve(this.#logger.info("Daemon started"));
		} catch (error) {
			// TODO: Retry logic
			this.#logger.error("Error", error);
			await this.stop();
		}
	};

	public readonly stop = async (): Promise<void> => {
		if (this.#isRunning === false) return;
		this.#logger.info("Stoping connection");
		await this.#channel.close();
		await this.#connection.close();
		return await Promise.resolve(this.#logger.info("Queue server disconnected"));
	};

	public readonly restart = async (): Promise<void> => {
		if (this.#isRunning === false) return;
		this.#logger.info("Restarting");
		await this.stop();
		return await Promise.resolve(this.start());
	};

	readonly #consume = async (message: ConsumeMessage | null): Promise<void> => {
		if (message === null) {
			this.#logger.warn("consume method received null message");
			return;
		}

		try {
			const event: IEvent<object> = JSON.parse(message.content.toString());
			this.#bus.emit(ACTIONS.QUEUE_CONSUME, event);
			return await Promise.resolve(this.#channel.ack(message));
		} catch (error) {
			if (error instanceof SyntaxError) this.#logger.warn("Problem consuming message: " + error.message);
			const exception = this.#errorHandler.catch({ name: this.constructor.name, ticket: message.properties.messageId, error });
			if (exception.code === 422) this.#logger.error("External Event incompatible", exception.cause);
		}
	};

	readonly #publish = async <M extends object>(event: IEvent<M>): Promise<void> => {
		const buffer = Buffer.from(JSON.stringify(event));
		// this.channel.publish(exchange, routingKey, content);
		return this.#channel.sendToQueue(this.#queue, buffer /*, { persistent: true } */)
			? await Promise.resolve(this.#logger.info(`Event ${event.metadata.id} published in queue ${this.#queue}`))
			: await Promise.reject(this.#logger.error(`failed sending event ${event.metadata.id}`));
	};
}
