import type { ControllerHandler } from "#Domain/business/Business";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.ts";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

export interface IAuthController {
	readonly login: ControllerHandler<UserSessionDTO>;
	readonly refreshToken: ControllerHandler<string>;
	readonly register: ControllerHandler<UserNonSensitiveData>;
	readonly activateAccount: ControllerHandler<string>;
	readonly forgotPassword: ControllerHandler<string>;
	readonly changePassword: ControllerHandler<string>;
}
