import { DEBUG_MODE } from "#Config";
import { Actions } from "#Domain/events/actions.enum.js";
import { errorHandler } from "#common/error-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";

import type { IEvent } from "#Domain/events/domain-event";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

type Handler = (event: IEvent<UserNonSensitiveData>) => Promise<void>;

export const getAccountAcctivatedSubscriber = (): Handler => {
	const action = Actions.ACCOUNT_ACTIVATED;
	const logger = new Logger(`Subscriber: ${action}`);

	const callback: Handler = async (e) => {
		if (DEBUG_MODE) logger.info("EXEC");
		logger.info("CALLBACK", e.correlationId);
		try {
			return await Promise.resolve();
		} catch (error) {
			errorHandler.catch({ name: action, error, ticket: e.correlationId });
		}
	};

	return async (e) => {
		logger.info("DOING SOMETHING", e.correlationId);
		try {
			callback(e);
			return await Promise.resolve();
		} catch (error) {
			errorHandler.catch({ name: action, error, ticket: e.correlationId });
		}
	};
};
