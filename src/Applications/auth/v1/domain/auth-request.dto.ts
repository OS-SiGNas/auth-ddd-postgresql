import { z } from "zod";

import { UsersRequestDTO } from "#users/v1/domain/users-request.dto.js";

import type { Parser } from "#Domain/business/Business";
import type { IAuthRequestDTO } from "./IAuthRequestDTO";
import type {
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
} from "./Request.js";

export class AuthRequestDTO implements IAuthRequestDTO {
	readonly #defaults = UsersRequestDTO.defaults;

	readonly login: Parser<LoginRequest> = async (request) => {
		const { email, password, uuid } = this.#defaults;
		const params = z.object({}).strict();
		const query = z.object({}).strict();
		const body = z.object({ email, password }).strict();
		const headers = z.object({ uuid });
		return await z.object({ params, query, body, headers }).parseAsync(request);
	};

	public readonly refreshToken: Parser<RefreshTokenRequest> = async (request) => {
		const params = z.object({}).strict();
		const query = z.object({}).strict();
		const body = z.object({ refreshToken: z.string() }).strict();
		const schema = z.object({ params, query, body });
		return await schema.parseAsync(request);
	};

	public readonly register: Parser<RegisterRequest> = async (request) => {
		const { email, name, password } = this.#defaults;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const body = z.object({ email, name, password }).strict();
		const schema = z.object({ query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly activateAccount: Parser<ActivateAccountRequest> = async (request) => {
		const { token, uuid } = this.#defaults;
		const query = z.object({}).strict();
		const params = z.object({ token }).strict();
		const headers = z.object({ uuid });
		return await z.object({ query, params, headers }).parseAsync(request);
	};

	public readonly forgotPassword: Parser<ForgotPasswordRequest> = async (request) => {
		const { email } = this.#defaults;
		const query = z.object({});
		const params = z.object({});
		const body = z.object({ email });
		const schema = z.object({ query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly changePassword: Parser<ChangePasswordRequest> = async (request) => {
		const { email, password } = this.#defaults;
		const query = z.object({});
		const params = z.object({});
		const body = z.object({ email, verificationString: z.string(), newPassword: password });

		const schema = z.object({ query, params, body });
		return await schema.parseAsync(request);
	};
}
