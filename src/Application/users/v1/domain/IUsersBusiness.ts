import type { Business } from "#Domain";
import type { UserNonSensitiveData } from "./IUser.js";
import type { UserDTO } from "../domain/users.dto.js";
import type {
	CreateUserRequest,
	GetOneUserRequest,
	GetAllUsersRequest,
	UpdateUserRequest,
	CreateUserRoleRequest,
	AddUserRolesRequest,
	DeleteUserRequest,
} from "./Request.js";

export interface IUsersBusiness {
	readonly createUser: Business<CreateUserRequest["body"], UserDTO>;
	readonly getOneUser: Business<GetOneUserRequest["params"], UserDTO>;
	readonly getAllUsers: Business<GetAllUsersRequest["query"], UserNonSensitiveData[]>;
	readonly updateUser: Business<UpdateUserRequest, boolean>;
	readonly createRole: Business<CreateUserRoleRequest["body"], boolean>;
	readonly rolesToUser: Business<AddUserRolesRequest, UserDTO>;
	readonly deleteUser: Business<DeleteUserRequest["params"], boolean>;
}
