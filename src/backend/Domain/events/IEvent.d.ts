export type EventContext = object | null;

interface EventMetadata {
	action: `${string}/${string}`;
	id: string;
	correlationId: string;
	createdAt: string;
	emitter: string;
	moduleEmitter: string;
}

export interface IEvent<M extends object, C extends EventContext = null> {
	readonly metadata: EventMetadata;
	readonly context: C;
	readonly message: M;
}

export interface EventPayload<M extends object, C extends EventContext> {
	metadata: {
		action: IEvent<M, C>["metadata"]["action"];
		correlationId: IEvent<M, C>["metadata"]["correlationId"];
		moduleEmitter: IEvent<M, C>["metadata"]["moduleEmitter"];
	};
	context: C;
	message: M;
}
