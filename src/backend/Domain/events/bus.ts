import { EventEmitter } from "node:events";

import { ACTIONS, type DomainEventBus } from "#Domain";

/**
 * @description: system event bus
 * @description: first define a new key in ACTIONS
 * @description: after define event handler in DomainEventBus interface */
export const bus: DomainEventBus = new EventEmitter();

bus.on(ACTIONS.SYSTEM_BOOT, async () => {
	await import("#Config");
	const { default: Main } = await import("../../main.js");
	const { default: subscribers } = await import("../../subscribers.js");
	const { systemDaemons } = await import("#Infrastructure/system-daemons/index.js");
	new Main(subscribers, systemDaemons);
});
