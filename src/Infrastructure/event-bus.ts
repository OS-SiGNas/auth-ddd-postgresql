import { EventEmitter } from "node:events";
import type { DomainEventBus } from "#Domain/events/DomainEventBus";

export const eventBus: DomainEventBus = new EventEmitter();
void Promise.all([
	// Auth Subscribers
	import("#subscribers/applications/login.subscriber.js"),
	import("#subscribers/applications/account-activated.subscriber.js"),

	// User Subscribers
	// import("#subscribers"),
]);
