import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";

import { DEBUG_MODE } from "#Config";
import { errorHandler } from "#common/error-handler/make.js";
import { responseHandler } from "#common/response-handler/make.js";
import { sessionHandler } from "#common/session-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";

import { AuthController } from "../infrastructure/auth.controller.js";
import { randomUUID } from "node:crypto";

// mock
import { mockAuthBusiness as business } from "./__mock__/auth-business.mock.js";

import type { IResponse } from "#Domain/response/IResponse.js";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser.js";

describe("Testing AuthController", () => {
	const correlationId = randomUUID();
	const params = {};
	const query = {};

	const controller = new AuthController({
		logger: new Logger("[Test] AuthController"),
		responseHandler,
		sessionHandler,
		errorHandler,
		DEBUG_MODE,
		business,
	});

	describe("Testing register method", () => {
		it("should ", async () => {
			const body = {
				email: "",
				password: "",
				name: "",
			};

			const compareResponse: IResponse<UserNonSensitiveData> = {
				status: {
					code: 200,
					message: "OK",
					success: true,
					timestamp: Date.now().toString(),
				},
				data: {
					uuid: "",
					email: "",
					name: "",
					roles: [],
					createdAt: new Date(),
				},
			};

			const newUser = await controller.register({
				correlationId,
				params,
				query,
				body,
			});

			deepEqual(newUser, compareResponse);
		});
	});
});

/* 	describe("Testing activate account method", () => {
		it("should");
	});

	describe("Testing change password method", () => {
		it("should");
	});

	describe("Testing forgot password method", () => {
		it("should");
	});

	describe("Testing login method", () => {
		it("should ");
	});

	describe("Testing refresh token method", () => {
		it("should");
	}); */
