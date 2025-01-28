import { DEBUG_MODE } from "#config";
import { Actions } from "#Domain/business/events/actions.enum.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#shared/logger-handler/make.js";
import { errorHandler } from "#shared/error-handler/make.js";

// Errors
// import { EventException } from "#Domain/core/errors.factory.js";

import type { IEvent } from "#Domain/business/events/domain-event";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

type Handler = (event: IEvent<UserSessionDTO>) => Promise<void>;

export const loginSubscriber = new (class {
	readonly #action = Actions.LOGIN;
	readonly #subscribers: Map<string, Handler> = new Map();
	readonly #logger = new Logger(`Subscriber: ${this.#action}`);

	constructor() {
		// this.#subscribers.set("RRHH", this.#callback);

		/**
		void eventBus.on(this.#action, this.#sendEmail) */
		void eventBus.on(this.#action, this.#callback);
		void eventBus.on(this.#action, async (e) => {
			this.#logger.info("DOING SOMETHING");
			this.#logger.debug({ id: e.id, action: e.action, emitter: e.emitter });
			try {
				if (this.#subscribers.size > 0) this.#subscribers.forEach((handler) => void handler(e));
				return await Promise.resolve();
			} catch (error) {
				void errorHandler.catch({ name: this.#action, error });
			}
		});

		void this.#logger.info("Subscribed");
	}

	readonly #callback: Handler = async ({ id, action, emitter }) => {
		if (DEBUG_MODE) this.#logger.info("EXEC");
		if (DEBUG_MODE) this.#logger.debug({ id, action, emitter });
		try {
			// if (data === undefined) throw new EventException(`${id}`)
			return await Promise.resolve();
		} catch (error) {
			void errorHandler.catch({ name: this.#action, error });
		}
	};
})();
