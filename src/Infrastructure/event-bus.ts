import { EventEmitter } from "node:events";
import type { DomainEventBus } from "#Domain/events/DomainEventBus";

export const { eventBus } = new (class {
	readonly #eventBus: DomainEventBus;
	constructor(...subscribers: object[]) {
		this.#eventBus = new EventEmitter();
		void Promise.all(subscribers);
	}

	public get eventBus(): DomainEventBus {
		return this.#eventBus;
	}
})(
	// Auth Subscribers
	import("#subscribers/login.subscriber.js"),
	import("#subscribers/account-activated.subscriber.js")
);
