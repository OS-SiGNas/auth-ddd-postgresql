import type { ControllerHandler } from "#Domain/Business";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.ts";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { ActivateAccountRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RefreshTokenRequest, RegisterRequest } from "./Request";

export interface IAuthController {
	readonly login: ControllerHandler<LoginRequest, UserSessionDTO>;
	readonly refreshToken: ControllerHandler<RefreshTokenRequest, string>;
	readonly register: ControllerHandler<RegisterRequest, UserNonSensitiveData>;
	readonly activateAccount: ControllerHandler<ActivateAccountRequest, string>;
	readonly forgotPassword: ControllerHandler<ForgotPasswordRequest, string>;
	readonly changePassword: ControllerHandler<ChangePasswordRequest, string>;
}
