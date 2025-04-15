import type { Business } from "#Domain/Business";
import type { UserDTO } from "#users/v1/domain/users.dto";
import type { ActivateAccountRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest } from "./Request";

export interface IAuthBusiness {
	readonly login: Business<LoginRequest["body"], UserDTO | null>;
	readonly getUserByUuid: Business<string, UserDTO>;
	readonly register: Business<RegisterRequest["body"], UserDTO>;
	readonly activateAccount: Business<ActivateAccountRequest["params"], UserDTO>;
	readonly forgotPassword: Business<ForgotPasswordRequest["body"], boolean>;
	readonly changePassword: Business<ChangePasswordRequest["body"], boolean>;
}
