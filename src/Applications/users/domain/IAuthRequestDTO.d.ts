import type { Parser } from "../../../Domain/business/Business";
import type { AccountActivationRequest } from "../../auth/domain/request/account-activation.request";
import type { ActivateAccountRequest } from "../../auth/domain/request/activate-account.request";
import type { ChangePasswordRequest } from "../../auth/domain/request/change-password.request";
import type { ForgotPasswordRequest } from "../../auth/domain/request/forgot-password.request";
import type { LoginRequest } from "../../auth/domain/request/login.request";
import type { RefreshTokenRequest } from "../../auth/domain/request/refresh-token.request";
import type { RegisterRequest } from "../../auth/domain/request/register.request";

export interface IAuthRequestDTO {
	readonly login: Parser<LoginRequest>;
	readonly refreshToken: Parser<RefreshTokenRequest>;
	readonly register: Parser<RegisterRequest>;
	readonly accountActivation: Parser<AccountActivationRequest>;
	readonly activateAccount: Parser<ActivateAccountRequest>;
	readonly forgotPassword: Parser<ForgotPasswordRequest>;
	readonly changePassword: Parser<ChangePasswordRequest>;
}
