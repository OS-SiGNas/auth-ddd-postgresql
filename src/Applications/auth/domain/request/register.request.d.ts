export interface RegisterRequest {
	query: object;
	params: object;
	body: {
		email: string;
		password: string;
		name: string;
	};
}
