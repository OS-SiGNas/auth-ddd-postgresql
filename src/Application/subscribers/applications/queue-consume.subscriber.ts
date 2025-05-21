import { ACTIONS } from "#Domain";

import type { DomainEventBus } from "#Domain";

export class QueueConsumeSubscriber {
	constructor(bus: DomainEventBus) {
		bus.on(ACTIONS.QUEUE_CONSUME, (event) => {
			console.info(`Queue consume event: ${event}`);
		});
	}
}
