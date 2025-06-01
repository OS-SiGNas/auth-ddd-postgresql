import { ACTIONS } from "#Domain";

import type { DomainEventBus } from "#Domain";

export class QueueConsumeSubscriber {
	constructor(private readonly bus: DomainEventBus) {
		this.bus.on(ACTIONS.QUEUE_CONSUME, (event) => {
			console.info(`Queue consume event: ${event}`);
		});
	}
}
