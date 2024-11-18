export interface LoginRequest {
	params: object;
	query: object;
	body: {
		email: string;
		password: string;
	};
}

export interface ActivateAccountRequest {
	params: { token: string };
}

export interface ChangePasswordRequest {
	params: object;
	query: object;
	body: {
		email: string;
		verificationString: string;
		newPassword: string;
	};
}

export interface ForgotPasswordRequest {
	query: object;
	params: object;
	body: {
		email: string;
	};
}

export interface RegisterRequest {
	query: object;
	params: object;
	body: {
		email: string;
		password: string;
		name: string;
	};
}

export interface RefreshTokenRequest {
	params: object;
	query: object;
	body: {
		refreshToken: string;
	};
}
