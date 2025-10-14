import type { EventEmitter } from "node:events";
import type { LogObject } from "#Domain";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";
import type { IEvent } from "./IEvent";
import type { Actions } from "./actions.enum";

export type Subscribers = (bus: DomainEventBus) => void;
export type DomainEventBus = EventEmitter<{
	// system
	[Actions.SYSTEM_BOOT]: [{ boot: () => Promise<void> }];
	[Actions.SYSTEM_REBOOT]: [];
	[Actions.SYSTEM_SHUTDOWN]: [];
	[Actions.SYSTEM_LOG]: [LogObject, ...meta: unknown[]];

	// Queue
	[Actions.QUEUE_CONSUME]: [IEvent<object>];
	[Actions.QUEUE_PUBLISH]: [IEvent<object>];

	// auth
	[Actions.AUTH_LOGIN]: [IEvent<UserSessionDTO>];
	[Actions.AUTH_ACCOUNT_ACTIVATED]: [IEvent<UserNonSensitiveData>];
	[Actions.AUTH_ACCOUNT_REGISTERED]: [IEvent<UserNonSensitiveData>];
	[Actions.AUTH_ACCOUNT_PASSWORD_CHANGED]: [IEvent<UserNonSensitiveData>];
	[Actions.AUTH_EMAIL_ACTIVATE_ACCOUNT]: [IEvent<{ token: string; emailReceiver: string }>];
	[Actions.AUTH_EMAIL_FORGOT_PASSWORD]: [IEvent<{ hash: string; emailReceiver: string }>];

	// users
	[Actions.USERS_ACCOUNT_DELETED]: [IEvent<UserNonSensitiveData, { modifiedBy: string }>];
	[Actions.USERS_ACCOUNT_CREATED]: [];
	[Actions.USERS_ACCOUNT_CREDENTIALS_MODIFIED]: [];
}>;
