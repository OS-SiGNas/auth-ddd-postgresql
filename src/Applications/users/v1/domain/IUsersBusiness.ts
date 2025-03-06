import type { BusinessHandler } from "#Domain/Business.js";
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
	readonly createUser: BusinessHandler<CreateUserRequest["body"], UserDTO>;
	readonly getOneUser: BusinessHandler<GetOneUserRequest["params"], UserDTO>;
	readonly getAllUsers: BusinessHandler<GetAllUsersRequest["query"], UserNonSensitiveData[]>;
	readonly updateUser: BusinessHandler<UpdateUserRequest, boolean>;
	readonly createRole: BusinessHandler<CreateUserRoleRequest["body"], boolean>;
	readonly rolesToUser: BusinessHandler<AddUserRolesRequest, UserDTO>;
	readonly deleteUser: BusinessHandler<DeleteUserRequest["params"], boolean>;
}
