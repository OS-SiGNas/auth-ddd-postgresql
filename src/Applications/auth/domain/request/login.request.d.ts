export interface LoginRequest {
	params: object;
	query: object;
	body: {
		email: string;
		password: string;
	};
}
