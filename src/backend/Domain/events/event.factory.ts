import { secrets } from "#Config";
import { uuidGenerator } from "#common/uuid-generator.js";

import type { EventContext, EventMetadata, EventPayload, IEvent } from "#Domain";

export type EventFactory = <M extends object, C extends EventContext = null>(payload: EventPayload<M, C>) => IEvent<M, C>;

export const eventFactory: EventFactory = ({ metadata: { action, correlationId, moduleEmitter }, context, message }) => {
	const id = uuidGenerator();
	const createdAt = new Date().toISOString();
	const emitter = secrets.SERVICE_NAME;
	const metadata: EventMetadata = {
		action,
		id,
		correlationId,
		createdAt,
		emitter,
		moduleEmitter,
	};

	return { metadata, context, message };
};
