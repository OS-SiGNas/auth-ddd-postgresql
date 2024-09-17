import type { IUser } from "./IUser";
import type { RoleName } from "./role-name.enum";

export interface AddUserRolesRequest {
	params: { uuid: string };
	query: object;
	body: {
		roles: number[];
	};
}

export interface CreateUserRoleRequest {
	params: object;
	query: object;
	body: { name: RoleName };
}

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

export interface UpdateUserRequest {
	query: object;
	params: { uuid: string };
	body: Partial<IUser>;
}

export interface GetOneUserRequest {
	query: object;
	params: { uuid: string };
}

export interface GetAllUsersRequest {
	params: object;
	query: object;
}

export interface DeleteUserRequest {
	query: object;
	params: { uuid: string };
}
