import type { Business } from "#Domain";
import type { UserDTO } from "#users/v1/domain/users.dto";
import type { ActivateAccountRequest, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest } from "./Request";

interface Login {
	login: LoginRequest["body"];
	correlationId: string;
}
export interface IAuthBusiness {
	readonly login: Business<Login, UserDTO | null>;
	readonly getUserByUuid: Business<string, UserDTO>;
	readonly register: Business<RegisterRequest["body"], UserDTO>;
	readonly activateAccount: Business<ActivateAccountRequest["body"], UserDTO>;
	readonly forgotPassword: Business<ForgotPasswordRequest["body"], boolean>;
	readonly changePassword: Business<ChangePasswordRequest["body"], boolean>;
}
