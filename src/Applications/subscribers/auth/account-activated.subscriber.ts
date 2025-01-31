import { DEBUG_MODE } from "#Config";
import { Actions } from "#Domain/business/events/actions.enum.js";
import { DomainEvenBus, eventBus } from "#Infrastructure/event-bus.js";
import { errorHandler } from "#shared/error-handler/make.js";
import { Logger } from "#shared/logger-handler/make.js";

// Errors
// import { EventException } from "#Domain/core/errors.factory.js";

import type { IEvent } from "#Domain/business/events/domain-event";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

type Handler = (event: IEvent<UserNonSensitiveData>) => Promise<void>;

export const accountAcctivatedSubscriber = new (class {
	readonly #action = Actions.ACCOUNT_ACTIVATED;

	readonly #eventBus: DomainEvenBus = eventBus;
	readonly #logger = new Logger(`Subscriber: ${this.#action}`);
	constructor() {
		void this.#eventBus
			// .on(this.#name, this.#something)
			.on(this.#action, this.#callback)
			.on(this.#action, async (e) => {
				this.#logger.info("DOING SOMETHING");
				this.#logger.debug({ id: e.id, action: e.action, emitter: e.emitter });
				try {
					// throw new EventException(`${id}`)
					return await Promise.resolve();
				} catch (error) {
					void errorHandler.catch({ name: this.#action, error });
				}
			});

		this.#logger.info("Subscribed");
	}

	readonly #callback: Handler = async ({ id, action, emitter /*, message */ }) => {
		if (DEBUG_MODE) this.#logger.info("EXEC");
		if (DEBUG_MODE) this.#logger.debug({ id, action, emitter });
		try {
			// throw new EventException(`${id}`)
			return await Promise.resolve();
		} catch (error) {
			void errorHandler.catch({ name: this.#action, error });
		}
	};
})();
