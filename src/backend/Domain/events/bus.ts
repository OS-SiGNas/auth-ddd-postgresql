import { EventEmitter } from "node:events";

import { ACTIONS, type DomainEventBus } from "#Domain";

/**
 * @description: system event bus
 * @description: first define a new key in ACTIONS
 * @description: after define event handler in DomainEventBus interface */
export const bus: DomainEventBus = new EventEmitter();

bus.on(ACTIONS.SYSTEM_BOOT, async () => {
	const awaitConfig = import("#Config");
	const awaitMain = import("../../main.js");
	const awaitSubscribers = import("../../subscribers.js");
	const awaitSystemDaemons = import("#Infrastructure/system-daemons/index.js");

	await awaitConfig;
	const { default: Main } = await awaitMain;
	const { default: subscribers } = await awaitSubscribers;
	const { systemDaemons } = await awaitSystemDaemons;

	new Main(subscribers, systemDaemons);
});
