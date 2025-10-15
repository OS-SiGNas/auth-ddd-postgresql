import { EventEmitter } from "node:events";
import { Actions, type DomainEventBus } from "#Domain";

/**
 * @description: System event bus
 * @description: 1 - first define a new key in Actions
 * @description: 2 - after define event handler in DomainEventBus interface */
export const bus: DomainEventBus = new EventEmitter();

bus.on(Actions.SYSTEM_BOOT, async ({ boot }) => await boot());
