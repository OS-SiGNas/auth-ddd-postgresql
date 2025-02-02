import { randomUUID } from "node:crypto";
import { z } from "zod";

import { secrets } from "#Config";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#shared/logger-handler/make.js";

import { Actions } from "./actions.enum";

import type { UUID } from "node:crypto";
import type { ILogger } from "#Domain/core/ILogger";

interface Default {
	id: UUID;
	createdAt: Date;
	emitter: string;
}

interface Payload<Msg> {
	action: Actions;
	moduleEmitter: string;
	context: Record<string, string>;
	transactionId: UUID;
	message: Msg;
}

export interface IEvent<Msg> extends Readonly<Default>, Readonly<Payload<Msg>> {}

export const DomainEvent = class<Msg> {
	static readonly #zUUID = z
		.string()
		.uuid()
		.transform((val) => val as UUID);

	public static defaultsSchema = {
		id: this.#zUUID,
		emitter: z.string(),
		createdAt: z.date(),
	};

	public static payloadSchema = {
		action: z.enum([
			// Actions
			Actions.REBOOT,
			Actions.LOGIN,
			Actions.ACCOUNT_ACTIVATED,
			Actions.NEW_ACCOUNT_REGISTERED,
		]),
		context: z.object({}),
		moduleEmitter: z.string().nonempty(),
		transactionId: this.#zUUID,
	};

	readonly #logger: ILogger = new Logger("DomainEvent");
	readonly #bus = eventBus;
	readonly #event: IEvent<Msg>;

	/** Domain Event Bus
	 * @param p: payload event public data
	 * @constructor "new" emits the domain event when constructed.  */
	constructor(p: Payload<Msg>) {
		this.#event = {
			// private
			id: randomUUID(),
			createdAt: new Date(),
			emitter: secrets.APP_NAME,

			// public
			action: p.action,
			transactionId: p.transactionId,
			moduleEmitter: p.moduleEmitter,
			context: p.context,
			message: p.message,
		};

		void this.#bus.emit(p.action, this.#event);
	}

	public get default(): Readonly<Default> {
		this.#logger.debug(`Get - Defaults - ${this.#event.moduleEmitter}`);
		return {
			id: this.#event.id,
			createdAt: this.#event.createdAt,
			emitter: this.#event.emitter,
		};
	}

	public get payload(): Readonly<Payload<undefined>> {
		this.#logger.info(`Get - Data - ${this.#event.moduleEmitter}`);
		return {
			action: this.#event.action,
			transactionId: this.#event.transactionId,
			moduleEmitter: this.#event.moduleEmitter,
			context: this.#event.context,
			message: undefined,
		};
	}

	public get message(): Readonly<Msg> {
		return this.#event.message;
	}
};
