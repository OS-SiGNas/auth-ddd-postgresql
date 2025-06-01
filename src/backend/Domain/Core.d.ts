import type { EventFactory } from "./events/event.factory";
import type { DomainEventBus } from "./events/DomainEventBus";
import type { ILogger } from "./ILogger";

export interface EventHandler {
	readonly bus: DomainEventBus;
	readonly eventFactory: EventFactory;
}

export interface Core extends EventHandler {
	readonly DEBUG: boolean;
	readonly logger: ILogger;
}
