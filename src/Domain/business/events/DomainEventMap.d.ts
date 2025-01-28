import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { Actions } from "./actions.enum";
import type { IEvent } from "./domain-event";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

export interface DomainEventMap extends Record<Actions, unknown[]> {
	[Actions.LOGIN]: [IEvent<UserSessionDTO>];
	[Actions.ACCOUNT_ACTIVATED]: [IEvent<UserNonSensitiveData>];
	[Actions.REBOOT]: [IEvent<object>];
}
