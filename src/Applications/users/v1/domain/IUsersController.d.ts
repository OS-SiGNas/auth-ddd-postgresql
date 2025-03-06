import type { ControllerHandler } from "#Domain/Business";
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
	readonly getOneUser: ControllerHandler<GetOneUserRequest, UserNonSensitiveData>;
	readonly getAllUsers: ControllerHandler<GetAllUsersRequest, UserNonSensitiveData[]>;
	readonly postUser: ControllerHandler<CreateUserRequest, UserNonSensitiveData>;
	readonly patchUser: ControllerHandler<UpdateUserRequest, string>;
	readonly createRole: ControllerHandler<CreateUserRoleRequest, string>;
	readonly rolesToUser: ControllerHandler<AddUserRolesRequest, UserNonSensitiveData>;
	readonly deleteUser: ControllerHandler<DeleteUserRequest, string>;
}
