import { Actions, type Subscribers } from "#Domain";

export const subscribers: Subscribers = (bus): void => {
	bus.on(Actions.AUTH_LOGIN, () => {});
	bus.on(Actions.AUTH_ACCOUNT_ACTIVATED, () => {});
	bus.on(Actions.AUTH_ACCOUNT_PASSWORD_CHANGED, () => {});
	bus.on(Actions.AUTH_ACCOUNT_REGISTERED, () => {});
	bus.on(Actions.AUTH_EMAIL_FORGOT_PASSWORD, () => {});
	bus.on(Actions.USERS_ACCOUNT_CREATED, () => {});
	bus.on(Actions.USERS_ACCOUNT_CREDENTIALS_MODIFIED, () => {});
	bus.on(Actions.USERS_ACCOUNT_DELETED, () => {});
};
