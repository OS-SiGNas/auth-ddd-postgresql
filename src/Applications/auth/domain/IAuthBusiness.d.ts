import type { BusinessHandler } from "../../../Domain/business/Business";
import type { UserDTO } from "../../users/domain/users.dto";
import type { AccountActivationRequest } from "./request/account-activation.request";
// import type { ActivateAccountRequest } from "./request/activate-account.request";
import type { ChangePasswordRequest } from "./request/change-password.request";
import type { ForgotPasswordRequest } from "./request/forgot-password.request";
import type { LoginRequest } from "./request/login.request";
import type { RegisterRequest } from "./request/register.request";

export interface IAuthBusiness {
	readonly login: BusinessHandler<LoginRequest["body"], UserDTO | null>;
	readonly getUserByUuid: BusinessHandler<string, UserDTO>;
	readonly register: BusinessHandler<RegisterRequest["body"], UserDTO>;
	readonly activateAccount: BusinessHandler<AccountActivationRequest["params"], boolean>;
	readonly forgotPassword: BusinessHandler<ForgotPasswordRequest["body"], boolean>;
	readonly changePassword: BusinessHandler<ChangePasswordRequest["body"], boolean>;
}
