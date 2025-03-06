import type { BusinessHandler } from "#Domain/Business";
import type { UserDTO } from "#users/v1/domain/users.dto";
import type { ActivateAccountRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest } from "./Request";

export interface IAuthBusiness {
	readonly login: BusinessHandler<LoginRequest["body"], UserDTO | null>;
	readonly getUserByUuid: BusinessHandler<string, UserDTO>;
	readonly register: BusinessHandler<RegisterRequest["body"], UserDTO>;
	readonly activateAccount: BusinessHandler<ActivateAccountRequest["params"], UserDTO>;
	readonly forgotPassword: BusinessHandler<ForgotPasswordRequest["body"], boolean>;
	readonly changePassword: BusinessHandler<ChangePasswordRequest["body"], boolean>;
}
