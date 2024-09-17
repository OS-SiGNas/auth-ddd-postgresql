import type { Parser } from "../../../Domain/business/Business";
import type {
	LoginRequest,
	RegisterRequest,
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	RefreshTokenRequest,
} from "../../auth/domain/Request";

export interface IAuthRequestDTO {
	readonly login: Parser<LoginRequest>;
	readonly refreshToken: Parser<RefreshTokenRequest>;
	readonly register: Parser<RegisterRequest>;
	readonly activateAccount: Parser<ActivateAccountRequest>;
	readonly forgotPassword: Parser<ForgotPasswordRequest>;
	readonly changePassword: Parser<ChangePasswordRequest>;
}
