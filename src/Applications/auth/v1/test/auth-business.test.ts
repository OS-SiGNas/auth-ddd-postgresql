import { describe, it, mock } from "node:test";
import { equal } from "node:assert";

import { DEBUG_MODE } from "#Config";
import { StorageHandler } from "#common/storage.handler.js";
import { Logger } from "#common/logger-handler/make.js";
import { AuthBusiness } from "../applications/auth.business.js";

// mock
import { mockPasswordHandler as passwordHandler } from "./__mock__/passwordHandler.mock.js";
import { mockActivateAccountTokenHandler as activateAccountTokenHandler } from "./__mock__/activate-account-token-handler.mock.js";

describe("Testing auth business", () => {
	const business = new AuthBusiness({
		logger: new Logger("[Test] AuthBusiness"),
		activateAccountTokenHandler,
		passwordHandler,
		DEBUG_MODE,
		repository: mock.fn(),
		storage: new StorageHandler({
			logger: new Logger("[Test] StorageAuthBusiness"),
			cacheExpiredTime: 0.5 * 3600000,
			keyExpiredTime: 5 * 60000,
			DEBUG_MODE,
		}),
	});

	describe("Testing login method", () => {
		it("should return null when use login method", async () => {
			const user = await business.login({
				email: "",
				password: "",
			});

			equal(user, null);
		});
	});
});
