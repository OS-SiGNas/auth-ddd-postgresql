import type { Controller } from "#Domain";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.ts";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { ActivateAccountRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RefreshTokenRequest, RegisterRequest } from "./Request";

export interface IAuthController {
	readonly login: Controller<LoginRequest, UserSessionDTO>;
	readonly refreshToken: Controller<RefreshTokenRequest, string>;
	readonly register: Controller<RegisterRequest, UserNonSensitiveData>;
	readonly activateAccount: Controller<ActivateAccountRequest, string>;
	readonly forgotPassword: Controller<ForgotPasswordRequest, string>;
	readonly changePassword: Controller<ChangePasswordRequest, string>;
}
