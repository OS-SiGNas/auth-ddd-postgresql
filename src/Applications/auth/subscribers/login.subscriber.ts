import { DEBUG_MODE } from "#Config";
import { Actions } from "#Domain/business/events/actions.enum.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { authDto } from "./auth.dto.js";
import { Logger } from "#shared/logger-handler/make.js";
import { errorHandler } from "#shared/error-handler/make.js";
// Errors import { EventException } from "#Domain/core/errors.factory.js";

import type { IEvent } from "#Domain/business/events/domain-event";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";
import type { ILogger } from "#Domain/core/ILogger";

type Handler = (event: IEvent<UserSessionDTO>) => Promise<void>;

void new (class {
	readonly #action = Actions.LOGIN;
	readonly #bus = eventBus;
	readonly #logger: ILogger = new Logger(`Subscriber: ${this.#action}`);

	constructor() {
		/** Subscribers
		void this.#bus.on(this.#action, async (e) => await this.rrhh.subscribers(e);
		void this.#bus.on(this.#action, this.#callback) */
		void this.#bus.on(this.#action, this.#exec);
		void this.#bus.on(this.#action, async (domainEvent) => {
			const e = await authDto.LOGIN(domainEvent);
			const settled = await Promise.allSettled([
				// Subscribers steps
				this.#step1(e),
				this.#step2(e),
				this.#step3(e),
			]);

			for (const s of settled) {
				if (s.status === "rejected") this.#logger.error(s.status, s.reason);
				else console.log(s.value);
			}

			try {
				return await Promise.resolve();
			} catch (error) {
				void errorHandler.catch({ name: this.#action, ticket: e.transactionId, error });
				this.#logger.error(`Constructor error ${e.transactionId}`, { id: e.id, action: e.action, emitter: e.emitter });
			}
		});
	}

	readonly #exec: Handler = async ({ emitter, transactionId, message }) => {
		if (DEBUG_MODE) this.#logger.info(`Exec: ${transactionId}`);
		this.#logger.info(`New session: ${message.user.email}`);
		try {
			return await Promise.resolve();
		} catch (error) {
			this.#logger.error(`Callback error -> ${emitter} ${transactionId}`);
			void errorHandler.catch({ name: this.#action, ticket: transactionId, error });
		}
	};

	readonly #step1: Handler = async (e) => {
		this.#logger.info("Step 1 running");
		this.#logger.debug("Event: \n", e);
		return await Promise.resolve();
	};

	readonly #step2: Handler = async (e) => {
		this.#logger.info("Step 2 running");
		this.#logger.debug("Event: \n", e);
		return await Promise.resolve();
	};

	readonly #step3: Handler = async (e) => {
		this.#logger.info("Step 3 running");
		this.#logger.debug("Event: \n", e);
		return await Promise.resolve();
	};

	public set handler(h: Handler) {
		void this.#bus.on(this.#action, h);
	}
})();
