import { DEBUG_MODE } from "#Config";
import { Actions } from "#Domain/events/actions.enum.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#shared/logger-handler/make.js";
import { errorHandler } from "#shared/error-handler/make.js";

import type { IEvent } from "#Domain/events/domain-event";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";
import type { ILogger } from "#Domain/core/ILogger";
import type { DomainEventBus } from "#Domain/events/DomainEventBus";

type Handler = (event: IEvent<UserSessionDTO>) => Promise<void>;

void new (class {
	readonly #bus: DomainEventBus = eventBus;
	readonly #logger: ILogger = new Logger(`Subscriber: ${Actions.LOGIN}`);

	constructor() {
		/** Subscribers
		void this.#bus.on(this.#action, async (e) => await this.rrhh.subscribers(e);
		void this.#bus.on(this.#action, this.#callback) */
		void this.#bus.on(Actions.LOGIN, this.#exec);
		void this.#bus.on(Actions.LOGIN, async (e) => {
			// const e = await authDto.LOGIN(domainEvent);

			const settled = await Promise.allSettled([
				// Subscribers steps
				this.#step1(e),
				this.#step2(e),
				this.#step3(e),
			]);

			for (const s of settled) {
				if (s.status === "rejected") this.#logger.error(s.status, s.reason);
				else this.#logger.debug(`${s.status}:`, s.value);
			}

			try {
				return await Promise.resolve();
			} catch (error) {
				void errorHandler.catch({ name: Actions.LOGIN, ticket: e.correlationId, error });
				this.#logger.error(`Constructor error ${e.correlationId}`, { id: e.id, action: e.action, emitter: e.emitter });
			}
		});

		this.#logger.info("Subscribed");
	}

	readonly #exec: Handler = async ({ emitter, correlationId, message }) => {
		if (DEBUG_MODE) this.#logger.info(`Exec: ${correlationId}`);
		this.#logger.info(`New session: ${message.user.email}`);
		try {
			return await Promise.resolve();
		} catch (error) {
			this.#logger.error(`Callback error -> ${emitter} ${correlationId}`);
			void errorHandler.catch({ name: Actions.LOGIN, ticket: correlationId, error });
		}
	};

	readonly #step1: Handler = async (e) => {
		this.#logger.info("Step 1 running");
		this.#logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	readonly #step2: Handler = async (e) => {
		this.#logger.info("Step 2 running");
		this.#logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	readonly #step3: Handler = async (e) => {
		this.#logger.info("Step 3 running");
		this.#logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	public set handler(h: Handler) {
		void this.#bus.on(Actions.LOGIN, h);
	}
})();
