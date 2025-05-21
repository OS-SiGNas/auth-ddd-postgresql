import type { ACTIONS } from "./actions.enum";

export interface IEvent<Message extends object, Context = undefined> {
	action: ACTIONS;
	id: string;
	correlationId: string;
	createdAt: string;
	emitter: string;
	moduleEmitter: string;
	context?: Context;
	message: Message;
}
