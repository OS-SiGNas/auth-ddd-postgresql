import type { IEvent } from "./domain-event";

export interface Subscriber {
	exec: <M>(e: IEvent<M>) => Promise<void>;
}
