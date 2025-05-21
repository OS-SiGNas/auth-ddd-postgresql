import type { EventEmitter } from "node:events";
import type { ACTIONS } from "./actions.enum";
import type { IEvent } from "./IEvent";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

type E<M extends object> = Readonly<IEvent<M>>;

interface EventMap {
	// system
	[ACTIONS.SYSTEM_REBOOT]: [E<never>];

	// Queue
	[ACTIONS.QUEUE_CONSUME]: [E<object>];
	[ACTIONS.QUEUE_PUBLISH]: [E<object>];

	// auth
	[ACTIONS.AUTH_LOGIN]: [E<UserSessionDTO>];
	[ACTIONS.AUTH_ACCOUNT_ACTIVATED]: [E<UserNonSensitiveData>];
	[ACTIONS.AUTH_NEW_ACCOUNT_REGISTERED]: [E<UserNonSensitiveData>];
	[ACTIONS.AUTH_USER_PASSWORD_CHANGED]: [E<UserNonSensitiveData>];

	// users
}

export type DomainEventBus = EventEmitter<EventMap>;
