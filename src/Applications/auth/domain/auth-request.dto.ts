import { z } from "zod";

import { UsersRequestDTO } from "../../users/domain/users-request.dto.js";

import type { Parser } from "../../../Domain/business/Business";
import type { IAuthRequestDTO } from "../../users/domain/IAuthRequestDTO";
import type { LoginRequest } from "./request/login.request";
import type { RegisterRequest } from "./request/register.request";
import type { ActivateAccountRequest } from "./request/activate-account.request";
import type { ForgotPasswordRequest } from "./request/forgot-password.request";
import type { ChangePasswordRequest } from "./request/change-password.request";

export class AuthRequestDTO implements IAuthRequestDTO {
  readonly #defaults = UsersRequestDTO.defaults;

  readonly login: Parser<LoginRequest> = async (request) => {
    const { email, password } = this.#defaults;
    const params = z.object({}).strict();
    const query = z.object({}).strict();
    const body = z.object({ email, password }).strict();
    const schema = z.object({ params, query, body });
    return await schema.parseAsync(request);
  };

  readonly register: Parser<RegisterRequest> = async (request) => {
    const { uuid, email, name, password } = this.#defaults;
    const query = z.object({}).strict();
    const params = z.object({}).strict();
    const body = z.object({ uuid, email, name, password }).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  readonly activateAccount: Parser<ActivateAccountRequest> = async (request) => {
    const query = z.object({}).strict();
    const params = z.object({ token: z.string() }).strict();
    const body = z.object({}).strict();
    const schema = z.object({ query, params, body }).strict();
    return await schema.parseAsync(request);
  };

  readonly forgotPassword: Parser<ForgotPasswordRequest> = async (request) => {
    const { email } = this.#defaults;
    const query = z.object({});
    const params = z.object({});
    const body = z.object({ email });
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  readonly changePassword: Parser<ChangePasswordRequest> = async (request) => {
    const { email, password } = this.#defaults;
    const query = z.object({});
    const params = z.object({});
    const body = z.object({ email, verificationString: z.string(), newPassword: password });

    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };
}
