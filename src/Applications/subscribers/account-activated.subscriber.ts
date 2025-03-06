import { DEBUG_MODE } from "#Config";
import { Actions } from "#Domain/events/actions.enum.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { errorHandler } from "#shared/error-handler/make.js";
import { Logger } from "#shared/logger-handler/make.js";

// Errors
// import { EventException } from "#Domain/core/errors.factory.js";

import type { IEvent } from "#Domain/events/domain-event";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

type Handler = (event: IEvent<UserNonSensitiveData>) => Promise<void>;

export const accountAcctivatedSubscriber = new (class {
	readonly #action = Actions.ACCOUNT_ACTIVATED;

	readonly #bus = eventBus;
	readonly #logger = new Logger(`Subscriber: ${this.#action}`);

	constructor() {
		void this.#bus
			// .on(this.#name, this.#something)
			.on(this.#action, this.#callback)
			.on(this.#action, async (e) => {
				this.#logger.info("DOING SOMETHING", e.correlationId);
				try {
					// throw new EventException(`${id}`)
					return await Promise.resolve();
				} catch (error) {
					void errorHandler.catch({ name: this.#action, error, ticket: e.correlationId });
				}
			});

		this.#logger.info("Subscribed");
	}

	readonly #callback: Handler = async (e) => {
		if (DEBUG_MODE) this.#logger.info("EXEC");
		this.#logger.info("CALLBACK", e.correlationId);
		try {
			// throw new EventException(`${id}`)
			return await Promise.resolve();
		} catch (error) {
			void errorHandler.catch({ name: this.#action, error, ticket: e.correlationId });
		}
	};
})();
