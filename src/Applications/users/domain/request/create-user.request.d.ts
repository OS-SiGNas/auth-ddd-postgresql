import { RoleName } from "../role-name.enum";

export interface CreateUserRequest {
	query: object;
	params: object;
	body: {
		email: string;
		name: string;
		password: string;
		roles: RoleName[];
	};
}
