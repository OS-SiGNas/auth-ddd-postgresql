import { UUID } from "crypto";

interface HeadersParsed {
	uuid: UUID;
}

export interface LoginRequest {
	headers: HeadersParsed;
	params: object;
	query: object;
	body: { email: string; password: string };
}

export interface ActivateAccountRequest {
	headers: HeadersParsed;
	params: { token: string };
}

export interface ChangePasswordRequest {
	headers: HeadersParsed;
	params: object;
	query: object;
	body: { email: string; verificationString: string; newPassword: string };
}

export interface ForgotPasswordRequest {
	headers: HeadersParsed;
	query: object;
	params: object;
	body: { email: string };
}

export interface RegisterRequest {
	headers: HeadersParsed;
	query: object;
	params: object;
	body: { email: string; password: string; name: string };
}

export interface RefreshTokenRequest {
	headers: HeadersParsed;
	params: object;
	query: object;
	body: { refreshToken: string };
}
