export interface RefreshTokenRequest {
	params: object;
	query: object;
	body: {
		refreshToken: string;
	};
}
