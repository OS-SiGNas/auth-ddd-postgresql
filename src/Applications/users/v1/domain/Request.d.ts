import type { IRequest } from "#Domain/IRequest";
import type { IUser } from "./IUser";
import type { RoleName } from "./role-name.enum";

export interface AddUserRolesRequest extends IRequest {
	params: { uuid: string };
	query: object;
	body: {
		roles: number[];
	};
}

export interface CreateUserRoleRequest extends IRequest {
	params: object;
	query: object;
	body: { name: RoleName };
}

export interface CreateUserRequest extends IRequest {
	query: object;
	params: object;
	body: {
		email: string;
		name: string;
		password: string;
		roles: RoleName[];
	};
}

export interface UpdateUserRequest extends IRequest {
	query: object;
	params: { uuid: string };
	body: Partial<IUser>;
}

export interface GetOneUserRequest extends IRequest {
	query: object;
	params: { uuid: string };
}

export interface GetAllUsersRequest extends IRequest {
	params: object;
	query: object;
}

export interface DeleteUserRequest extends IRequest {
	query: object;
	params: { uuid: string };
}
