import type { AsyncParser } from "#Domain/Business";
import type {
	AddUserRolesRequest,
	CreateUserRequest,
	CreateUserRoleRequest,
	DeleteUserRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
} from "./Request";

export interface IUsersRequestDTO {
	readonly getOneUser: AsyncParser<GetOneUserRequest>;
	readonly getAllUsers: AsyncParser<GetAllUsersRequest>;
	readonly createUser: AsyncParser<CreateUserRequest>;
	readonly updateUser: AsyncParser<UpdateUserRequest>;
	readonly rolesToUser: AsyncParser<AddUserRolesRequest>;
	readonly createRole: AsyncParser<CreateUserRoleRequest>;
	readonly deleteUser: AsyncParser<DeleteUserRequest>;
}
