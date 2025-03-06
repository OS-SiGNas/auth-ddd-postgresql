export interface LoginRequest {
	correlationId: string;
	params: object;
	query: object;
	body: {
		email: string;
		password: string;
	};
}

export interface ActivateAccountRequest {
	correlationId: string;
	params: { token: string };
}

export interface ChangePasswordRequest {
	correlationId: string;
	params: object;
	query: object;
	body: {
		email: string;
		verificationString: string;
		newPassword: string;
	};
}

export interface ForgotPasswordRequest {
	correlationId: string;
	query: object;
	params: object;
	body: { email: string };
}

export interface RegisterRequest {
	correlationId: string;
	query: object;
	params: object;
	body: {
		email: string;
		password: string;
		name: string;
	};
}

export interface RefreshTokenRequest {
	correlationId: string;
	params: object;
	query: object;
	body: { refreshToken: string };
}
