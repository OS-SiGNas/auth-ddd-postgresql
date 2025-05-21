import { z } from "zod";

import { UsersRequestDTO } from "#users/v1/application/users-request.dto.js";

import type { AsyncParser } from "#Domain";
import type { IAuthRequestDTO } from "../domain/IAuthRequestDTO";
import type {
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
} from "../domain/Request.js";

export class AuthRequestDTO implements IAuthRequestDTO {
	readonly #defaults = UsersRequestDTO.defaults;

	readonly login: AsyncParser<LoginRequest> = async (request) => {
		const { email, password, uuid } = this.#defaults;
		const correlationId = uuid;
		const params = z.object({}).strict();
		const query = z.object({}).strict();
		const body = z.object({ email, password }).strict();
		return await z.object({ params, query, body, correlationId }).parseAsync(request);
	};

	public readonly refreshToken: AsyncParser<RefreshTokenRequest> = async (request) => {
		const { uuid } = this.#defaults;
		const correlationId = uuid;
		const params = z.object({}).strict();
		const query = z.object({}).strict();
		const body = z.object({ refreshToken: z.string() }).strict();
		const schema = z.object({ params, query, body, correlationId });
		return await schema.parseAsync(request);
	};

	public readonly register: AsyncParser<RegisterRequest> = async (request) => {
		const { email, name, password, uuid } = this.#defaults;

		const correlationId = uuid;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const body = z.object({ email, name, password }).strict();
		const schema = z.object({ query, params, body, correlationId });
		return await schema.parseAsync(request);
	};

	public readonly activateAccount: AsyncParser<ActivateAccountRequest> = async (request) => {
		const { token, uuid } = this.#defaults;
		const correlationId = uuid;
		const query = z.object({}).strict();
		const params = z.object({ token }).strict();
		return await z.object({ query, params, correlationId }).parseAsync(request);
	};

	public readonly forgotPassword: AsyncParser<ForgotPasswordRequest> = async (request) => {
		const { email, uuid } = this.#defaults;

		const correlationId = uuid;
		const query = z.object({});
		const params = z.object({});
		const body = z.object({ email });
		const schema = z.object({ query, params, body, correlationId });
		return await schema.parseAsync(request);
	};

	public readonly changePassword: AsyncParser<ChangePasswordRequest> = async (request) => {
		const { email, password, uuid } = this.#defaults;

		const correlationId = uuid;
		const query = z.object({});
		const params = z.object({});
		const body = z.object({ email, verificationString: z.string(), newPassword: password });
		const schema = z.object({ query, params, body, correlationId });
		return await schema.parseAsync(request);
	};
}
