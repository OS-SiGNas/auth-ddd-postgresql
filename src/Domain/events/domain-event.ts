import { randomUUID } from "node:crypto";
import { z, ZodError } from "zod";

import { secrets } from "#Config";
import { UnprocessableException422 } from "#Domain/errors/error.factory.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { rabbitmq } from "#Infrastructure/system-demons/queue-connection/make.js";
import { Logger } from "#shared/logger-handler/make.js";
import { actionParseStrategies } from "#subscribers/domain/action-parse-strategies.js";
import { Actions } from "./actions.enum.js";

export interface IEvent<Message extends object> {
	action: Actions;
	id: string;
	correlationId: string;
	createdAt: string;
	emitter: string;
	moduleEmitter: string;
	context?: Record<string, string>;
	message: Message;
}

interface Dependeces<M extends object> {
	action: IEvent<M>["action"];
	id?: IEvent<M>["id"];
	correlationId: IEvent<M>["correlationId"];
	createdAt?: IEvent<M>["createdAt"];
	emitter?: IEvent<M>["emitter"];
	moduleEmitter: IEvent<M>["moduleEmitter"];
	context?: IEvent<M>["context"];
	message: M;
}

export const DomainEvent = class<M extends object> {
	readonly #event: IEvent<M>;
	readonly #logger = new Logger("DomainEvent");
	constructor(d: Dependeces<M>) {
		d.id ??= randomUUID();
		d.createdAt ??= new Date().toISOString();
		d.emitter ??= secrets.SERVICE_NAME;
		this.#event = DomainEvent.validate<M>(d as IEvent<M>);
	}

	public readonly emit = (): void => {
		this.#logger.info(`The module ${this.#event.moduleEmitter} is emitting event ${this.#event.id}`);
		void eventBus.emit(this.#event.action, this.#event);
	};

	public readonly publish = (): void => {
		this.#logger.info(`The module ${this.#event.moduleEmitter} is publishing event ${this.#event.id}`);
		void rabbitmq.publish(this.#event);
	};

	public getheaders = (consumer: string): Readonly<Omit<IEvent<M>, "message">> => {
		this.#logger.info(`${consumer} getting event headers`);
		return {
			action: this.#event.action,
			id: this.#event.id,
			correlationId: this.#event.correlationId,
			createdAt: this.#event.createdAt,
			emitter: this.#event.emitter,
			moduleEmitter: this.#event.moduleEmitter,
			context: this.#event.context,
		};
	};

	public getMessage(consumer: string): Readonly<M> {
		this.#logger.info(`${consumer} getting event message`);
		return this.#event.message;
	}

	public static validate = <M extends object>(e: IEvent<M>): Readonly<IEvent<M>> => {
		const zAction = z.enum([Actions.LOGIN, Actions.ACCOUNT_ACTIVATED, Actions.NEW_ACCOUNT_REGISTERED, Actions.REBOOT]);
		const zUUUID = z.string().uuid();
		const zString = z.string();
		// const zDate = z.date();
		// const zDate = z .string() .transform((str) => new Date(str)) .pipe(z.date());
		const zDate = z.string();
		const schemaDefauls = {
			action: zAction,
			id: zUUUID,
			createdAt: zDate,
			emitter: zString,
			moduleEmitter: zString,
			context: z.object({}).optional(),
			correlationId: zUUUID,
			message: z.object({}),
		};

		try {
			const headers: IEvent<object> = z.object(schemaDefauls).strict().parse(e);
			console.log("HEADERS LISTOS");
			const message = actionParseStrategies.parse<M>(headers.action, e.message);
			return { ...headers, message };
		} catch (error) {
			if (!(error instanceof ZodError)) throw error;
			const cause = error.issues.map(({ path, message }) => `(${path.join(" -> ")}): ${message}`);
			throw new UnprocessableException422(`(DomainEvent): Unable to build, payload is incompatible`, { cause });
		}
	};
};
