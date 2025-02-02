import { EventEmitter } from "node:events";
import type { DomainEventMap } from "#Domain/business/events/DomainEventMap";

export const { eventBus } = new (class {
	readonly #eventBus: EventEmitter<DomainEventMap>;

	constructor() {
		this.#eventBus = new EventEmitter();
		void Promise.all(this.#subscribers);
	}

	public get eventBus(): EventEmitter<DomainEventMap> {
		return this.#eventBus;
	}

	readonly #subscribers: object[] = [
		// Auth Subscribers
		import("#auth/subscribers/login.subscriber.js"),
		import("#auth/subscribers/account-activated.subscriber.js"),

		// Users Subscribers
		// import("#subscribers/users"),
	];
})();
