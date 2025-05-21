import { DEBUG } from "#Config";
import { ACTIONS } from "#Domain";
import { Logger } from "#common/logger-handler/make.js";
import { errorHandler } from "#common/error-handler/make.js";

import type { IEvent } from "#Domain";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

type Handler = (event: IEvent<UserSessionDTO>) => Promise<void>;

export const getLoginSubscriber = (): Handler => {
	const action = ACTIONS.AUTH_LOGIN;
	const logger = new Logger(`Subscriber: ${action}`);

	const step1: Handler = async (e) => {
		logger.info("Step 1 running");
		logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	const step2: Handler = async (e) => {
		logger.info("Step 2 running");
		logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	const step3: Handler = async (e) => {
		logger.info("Step 3 running");
		logger.debug("Event: ", e.correlationId);
		return await Promise.resolve();
	};

	return async (e) => {
		if (DEBUG) logger.info(`Exec: ${e.correlationId}`);
		logger.info(`New session: ${e.message.user.email}`);
		try {
			const settled = await Promise.allSettled([
				// some example
				step1(e),
				step2(e),
				step3(e),
			]);

			for (const s of settled) {
				if (s.status === "rejected") logger.error(s.status, s.reason);
				else logger.debug(`${s.status}:`, s.value);
			}

			return await Promise.resolve();
		} catch (error) {
			logger.error(`Callback error -> ${e.emitter} ${e.correlationId}`);
			errorHandler.catch({ name: action, ticket: e.correlationId, error });
		}
	};
};
