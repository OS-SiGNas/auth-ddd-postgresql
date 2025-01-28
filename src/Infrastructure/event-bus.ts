import { EventEmitter } from "node:events";

import type { DomainEventMap } from "#Domain/business/events/DomainEventMap";

export const eventBus = new EventEmitter<DomainEventMap>();

void Promise.all([
	// import Subscribers
	import("#subscribers/login.subscriber.js"),
	import("#subscribers/account-activated.subscriber.js"),
]);

export type DomainEvenBus = typeof eventBus;
