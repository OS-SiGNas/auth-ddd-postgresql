import type { AsyncParser } from "#Domain";
import type {
	LoginRequest,
	RegisterRequest,
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	RefreshTokenRequest,
} from "#auth/v1/domain/Request";

export interface IAuthRequestDTO {
	readonly login: AsyncParser<LoginRequest>;
	readonly refreshToken: AsyncParser<RefreshTokenRequest>;
	readonly register: AsyncParser<RegisterRequest>;
	readonly activateAccount: AsyncParser<ActivateAccountRequest>;
	readonly forgotPassword: AsyncParser<ForgotPasswordRequest>;
	readonly changePassword: AsyncParser<ChangePasswordRequest>;
}
