import { ACTIONS, type DomainEventBus } from "#Domain";

export default async (bus: DomainEventBus): Promise<void> => {
	bus.on(ACTIONS.AUTH_ACCOUNT_ACTIVATED, () => {});
	bus.on(ACTIONS.AUTH_ACCOUNT_PASSWORD_CHANGED, () => {});
	bus.on(ACTIONS.AUTH_ACCOUNT_REGISTERED, () => {});
	bus.on(ACTIONS.AUTH_EMAIL_FORGOT_PASSWORD, () => {});

	bus.on(ACTIONS.USERS_ACCOUNT_CREATED, () => {});
	bus.on(ACTIONS.USERS_ACCOUNT_CREDENTIALS_MODIFIED, () => {});
	bus.on(ACTIONS.USERS_ACCOUNT_DELETED, () => {});
};
