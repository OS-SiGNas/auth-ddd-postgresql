import type { EventEmitter } from "node:events";
import type { Actions } from "./actions.enum";
import type { IEvent } from "./domain-event";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

type E<M extends object> = Readonly<IEvent<M>>;

interface EventMap extends Record<Actions, [IEvent<object>]> {
	[Actions.REBOOT]: [E<never>];

	// auth
	[Actions.LOGIN]: [E<UserSessionDTO>];
	[Actions.ACCOUNT_ACTIVATED]: [E<UserNonSensitiveData>];

	// users
	//[Actions.]: [IEvent<never>];
}

export type DomainEventBus = EventEmitter<EventMap>;
