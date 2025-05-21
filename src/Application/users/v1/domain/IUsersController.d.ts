import type { Controller } from "#Domain";
import type { UserNonSensitiveData } from "./IUser";
import type {
	CreateUserRequest,
	CreateUserRoleRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
	AddUserRolesRequest,
	DeleteUserRequest,
} from "./Request";

export interface IUsersController {
	readonly getOneUser: Controller<GetOneUserRequest, UserNonSensitiveData>;
	readonly getAllUsers: Controller<GetAllUsersRequest, UserNonSensitiveData[]>;
	readonly postUser: Controller<CreateUserRequest, UserNonSensitiveData>;
	readonly patchUser: Controller<UpdateUserRequest, string>;
	readonly createRole: Controller<CreateUserRoleRequest, string>;
	readonly rolesToUser: Controller<AddUserRolesRequest, UserNonSensitiveData>;
	readonly deleteUser: Controller<DeleteUserRequest, string>;
}
