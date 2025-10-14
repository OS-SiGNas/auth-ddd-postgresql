import { EventEmitter } from "node:events";
import { Actions, type DomainEventBus } from "#Domain";

/**
 * @description: system event bus
 * @description: first define a new key in Actions
 * @description: after define event handler in DomainEventBus interface */
export const bus: DomainEventBus = new EventEmitter();

bus.on(Actions.SYSTEM_BOOT, async ({ boot }) => {
	await boot();
	const { subscribers } = await import("../../subscribers.js");
	return await Promise.resolve(subscribers(bus));
});
