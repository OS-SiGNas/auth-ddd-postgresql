import type { EventEmitter } from "node:events";
import type { Actions } from "./actions.enum";
import type { IEvent } from "./domain-event";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

interface DomainEventMap extends Record<Actions, unknown[]> {
	[Actions.REBOOT]: [Readonly<IEvent<never>>];

	// auth
	[Actions.LOGIN]: [Readonly<IEvent<UserSessionDTO>>];
	[Actions.ACCOUNT_ACTIVATED]: [Readonly<IEvent<UserNonSensitiveData>>];

	// users
	//[Actions.]: [IEvent<>];
}

export type DomainEventBus = EventEmitter<DomainEventMap>;
