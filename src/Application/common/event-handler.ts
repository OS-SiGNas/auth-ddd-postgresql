import { secrets } from "#Config";
import { uuidGenerator } from "./uuid-generator";

import type { ACTIONS, IEvent } from "#Domain";

interface Payload<Message, Context = undefined> {
	action: ACTIONS;
	correlationId: string;
	moduleEmitter: string;
	context: Context;
	message: Message;
}

type CreateEvent = <Message extends object, Context = undefined>(payload: Payload<Message, Context>) => IEvent<Message, Context>;

export const createEvent: CreateEvent = ({ action, correlationId, moduleEmitter, context, message }) => {
	const id = uuidGenerator();
	const createdAt = new Date().toISOString();
	const emitter = secrets.SERVICE_NAME;

	return {
		id,
		action,
		createdAt,
		emitter,
		correlationId,
		moduleEmitter,
		context,
		message,
	};
};
