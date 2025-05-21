import { describe, it } from "node:test";
import { deepEqual, rejects } from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { ZodError as PayloadError } from "zod";

import { AuthRequestDTO } from "../domain/auth-request.dto.js";

import type { LoginRequest, RegisterRequest } from "../domain/Request";

describe("Testing all auth request dto", () => {
	const dto = new AuthRequestDTO();
	const correlationId = randomUUID();
	const params = {};
	const query = {};

	describe("Testing auth register", () => {
		it("should throw payload error in register request when body is incorrect", () => {
			const failRequest01: RegisterRequest = {
				body: { email: "", name: "", password: "" },
				query,
				params,
				correlationId,
			};

			const failRequest02 = {
				body: { email: "" },
				query,
				params,
				correlationId,
			};

			const failRequest03 = {
				body: { name: "", password: "" },
				query,
				params,
				correlationId,
			};

			const failRequest04 = {
				body: { email: "", name: "", password: "" },
				query,
				params,
				correlationId,
			};

			const failRequest05 = {
				body: { email: "signas", name: "4234234", password: true },
				query,
				params,
				correlationId,
			};

			rejects(async () => await dto.register(failRequest01), PayloadError);
			rejects(async () => await dto.register(failRequest02), PayloadError);
			rejects(async () => await dto.register(failRequest03), PayloadError);
			rejects(async () => await dto.register(failRequest04), PayloadError);
			rejects(async () => await dto.register(failRequest05), PayloadError);
		});
	});

	describe("Testing auth activate account", () => {
		it("", () => {});
	});

	describe("Testing auth login", () => {
		it("should throw error when email and password is empty in request body", () => {
			const failRequest = {
				body: { email: "", password: "" },
				correlationId,
				params,
				query,
			};

			rejects(async () => await dto.login(failRequest), PayloadError);
		});

		it("should throw error when password is empty in request body", () => {
			const failRequest = {
				body: { email: "signas13@gmail.com", password: "" },
				correlationId,
				params,
				query,
			};

			rejects(async () => await dto.login(failRequest), PayloadError);
		});

		it("should throw error when email is empty in request body", () => {
			const failRequest = {
				body: { email: "", password: "123456789" },
				correlationId,
				params,
				query,
			};

			rejects(async () => await dto.login(failRequest), PayloadError);
		});

		it("should validate email format in request login", () => {
			const request = {
				body: { email: "signas13gmail.com", password: "123456789" },
				correlationId,
				params,
				query,
			};

			rejects(async () => await dto.login(request), PayloadError);
		});

		it("should validate password with minimum 10 characters", async () => {
			const failRequest: LoginRequest = {
				body: { email: "signas13@gmail.com", password: "123456789" },
				correlationId,
				params,
				query,
			};

			rejects(async () => await dto.login(failRequest), PayloadError);
		});

		it("should validate a successful login request and generate a dto", async () => {
			const request: LoginRequest = {
				body: { email: "signas13@gmail.com", password: "1234567890" },
				correlationId,
				params,
				query,
			};

			const result = await dto.login(request).catch((e) => console.log(e));
			deepEqual(result, request);
		});
	});

	describe("Testing auth refresh token", () => {
		it("", () => {});
	});

	describe("Testing auth change password", () => {
		it("", () => {});
	});

	describe("Testing auth forgot password", () => {
		it("", () => {});
	});
});
