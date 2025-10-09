import type { DomainEventBus } from "#Domain";
import { ACTIONS } from "#Domain";

export const getBuildSubscribers = async (bus: DomainEventBus) => {
	const { authEmailSubscriber } = await import("#auth/v1/make.js");

	bus.on(ACTIONS.AUTH_EMAIL_ACTIVATE_ACCOUNT, authEmailSubscriber.sendActivateAccountEmail);
	bus.on(ACTIONS.AUTH_EMAIL_FORGOT_PASSWORD, authEmailSubscriber.sendForgotPasswordEmail);
};
