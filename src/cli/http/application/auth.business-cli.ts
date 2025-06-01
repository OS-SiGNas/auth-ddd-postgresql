import { ENDPOINTS } from "#auth/v1/domain/endpoints.enum.js";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser.js";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.js";
import type { IHttpProxy, HttpProxyResponse } from "../domain/IHttpProxy.js";
import type { IAuthController } from "#auth/v1/domain/IAuthController.js";
import type {
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
} from "#auth/v1/domain/Request.js";

export class AuthBusinessCli implements Record<keyof IAuthController, unknown> {
	readonly #http: IHttpProxy;
	constructor(http: IHttpProxy) {
		this.#http = http;
	}

	public readonly login = async (payload: LoginRequest["body"], signal: AbortSignal): HttpProxyResponse<UserSessionDTO> => {
		return await this.#http.post<UserSessionDTO>(ENDPOINTS.LOGIN, payload, signal);
	};

	public readonly refreshToken = async (body: RefreshTokenRequest["body"], signal: AbortSignal): HttpProxyResponse<string> => {
		return await this.#http.post(ENDPOINTS.REFRESH_TOKEN, body, signal);
	};

	public readonly register = async (body: RegisterRequest["body"], signal: AbortSignal): HttpProxyResponse<UserNonSensitiveData> => {
		return await this.#http.post(ENDPOINTS.REGISTER, body, signal);
	};

	public readonly activateAccount = async (body: ActivateAccountRequest["body"], signal: AbortSignal): HttpProxyResponse<string> => {
		return await this.#http.patch(ENDPOINTS.ACTIVATE_ACCOUNT, body, signal);
	};

	public readonly forgotPassword = async (body: ForgotPasswordRequest["body"], signal: AbortSignal): HttpProxyResponse<string> => {
		return await this.#http.post(ENDPOINTS.FORGOT_PASSWORD, body, signal);
	};

	public readonly changePassword = async (body: ChangePasswordRequest["body"], signal: AbortSignal): HttpProxyResponse<string> => {
		return await this.#http.patch(ENDPOINTS.CHANGE_PASSWORD, body, signal);
	};
}
