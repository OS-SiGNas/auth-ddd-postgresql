import { ACTIONS } from "#Domain";
import { errorHandler } from "#common/error-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";

import type { IEvent } from "#Domain";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

type Handler = (event: IEvent<UserNonSensitiveData>) => Promise<void>;

export const getAccountAcctivatedSubscriber = (): Handler => {
	const _action = ACTIONS.AUTH_ACCOUNT_ACTIVATED;
	const _logger = new Logger(`Subscriber: ${_action}`);

	return async ({ metadata: { correlationId } }) => {
		_logger.info("DOING SOMETHING", correlationId);

		try {
			return await Promise.resolve(undefined);
		} catch (error) {
			void errorHandler.catch({ name: _action, error, ticket: correlationId });
			return await Promise.reject(undefined);
		}
	};
};
