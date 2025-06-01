import type { EventEmitter } from "node:events";
import type { ACTIONS } from "./actions.enum";
import type { IEvent } from "./IEvent";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

interface EventMap {
	// system
	[ACTIONS.SYSTEM_REBOOT]: [IEvent<never>];
	[ACTIONS.SYSTEM_SHUTDOWN]: [];

	// Queue
	[ACTIONS.QUEUE_CONSUME]: [IEvent<object>];
	[ACTIONS.QUEUE_PUBLISH]: [IEvent<object>];

	// auth
	[ACTIONS.AUTH_LOGIN]: [IEvent<UserSessionDTO>];
	[ACTIONS.AUTH_ACCOUNT_ACTIVATED]: [IEvent<UserNonSensitiveData>];
	[ACTIONS.AUTH_ACCOUNT_REGISTERED]: [IEvent<UserNonSensitiveData>];
	[ACTIONS.AUTH_ACCOUNT_PASSWORD_CHANGED]: [IEvent<UserNonSensitiveData>];
	[ACTIONS.AUTH_EMAIL_ACTIVATE_ACCOUNT]: [IEvent<{ token: string; emailReceiver: string }>];
	[ACTIONS.AUTH_EMAIL_FORGOT_PASSWORD]: [IEvent<{ hash: string; emailReceiver: string }>];

	// users
	[ACTIONS.USERS_ACCOUNT_DELETED]: [IEvent<UserNonSensitiveData, { modifiedBy: string }>];
}

export type DomainEventBus = EventEmitter<EventMap>;
