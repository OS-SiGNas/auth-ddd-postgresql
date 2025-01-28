import { randomUUID } from "node:crypto";

import { secrets } from "#config";
import { eventBus } from "#Infrastructure/event-bus.js";

import { Logger } from "#shared/logger-handler/make.js";

import type { UUID } from "node:crypto";
import type { Actions } from "./actions.enum";
import type { ILogger } from "#Domain/core/ILogger";

interface Default {
	id: UUID;
	createdAt: Date;
	emitter: string;
}

interface Data<Msg> {
	action: Actions;
	moduleEmitter: string;
	context: Record<string, string>;
	transactionId: UUID;
	message?: Msg;
}

export interface IEvent<Msg> extends Readonly<Default>, Readonly<Data<Msg>> {}

export const DomainEvent = class<Msg> {
	readonly #logger: ILogger = new Logger("DomainEvent");
	readonly #event: IEvent<Msg>;

	/**
	 * [ Domain Event Bus ]
	 * This constructor "new" emits the domain event when constructed.  */
	constructor(e: Data<Msg | undefined>) {
		this.#event = {
			// private
			id: randomUUID(),
			createdAt: new Date(),
			emitter: secrets.APP_NAME,

			// public
			action: e.action,
			transactionId: e.transactionId,
			moduleEmitter: e.moduleEmitter,
			context: e.context,
			message: e.message,
		};

		eventBus.emit(e.action, this.#event);
	}

	public get default(): Readonly<Default> {
		this.#logger.debug(`Get - Defaults - ${this.#event.moduleEmitter}`);

		return {
			id: this.#event.id,
			createdAt: this.#event.createdAt,
			emitter: this.#event.emitter,
		};
	}

	public get data(): Readonly<Data<Msg>> {
		this.#logger.info(`Get - Data - ${this.#event.moduleEmitter}`);

		return {
			action: this.#event.action,
			transactionId: this.#event.transactionId,
			moduleEmitter: this.#event.moduleEmitter,
			context: this.#event.context,
			message: this.#event.message,
		};
	}
};
