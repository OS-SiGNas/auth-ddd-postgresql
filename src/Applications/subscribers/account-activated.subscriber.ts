import { DEBUG_MODE } from "#config";
import { Actions } from "#Domain/business/events/actions.enum.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { errorHandler } from "#shared/error-handler/make.js";
import { Logger } from "#shared/logger-handler/make.js";

// Errors
// import { EventException } from "#Domain/core/errors.factory.js";

import type { IEvent } from "#Domain/business/events/domain-event";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
type Handler = (event: IEvent<UserNonSensitiveData>) => Promise<void>;

/** Sincleton */ void new (class {
	readonly #name = Actions.ACCOUNT_ACTIVATED;
	readonly #logger = new Logger(`Subscriber: ${this.#name}`);

	constructor() {
		/**
		void eventBus.on(this.#name, this.#sendEmail) */
		void eventBus.on(this.#name, this.#callback);
		void eventBus.on(this.#name, async (e) => {
			if (DEBUG_MODE) this.#logger.info("DOING SOMETHING");
			if (DEBUG_MODE) this.#logger.debug({ id: e.id, action: e.action, emitter: e.emitter });
			try {
				// throw new EventException(`${id}`)
				return await Promise.resolve();
			} catch (error) {
				void errorHandler.catch({ name: this.#name, error });
			}
		});

		void this.#logger.info("Subscribed");
	}

	readonly #callback: Handler = async ({ id, action, emitter }) => {
		if (DEBUG_MODE) this.#logger.info("EXEC");
		if (DEBUG_MODE) this.#logger.debug({ id, action, emitter });
		try {
			// throw new EventException(`${id}`)
			return await Promise.resolve();
		} catch (error) {
			void errorHandler.catch({ name: this.#name, error });
		}
	};
})();
