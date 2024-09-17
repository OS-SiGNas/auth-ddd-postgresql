import type { Parser } from "../../../Domain/business/Business";
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
	readonly getUser: Parser<GetOneUserRequest>;
	readonly getAllUsers: Parser<GetAllUsersRequest>;
	readonly createUser: Parser<CreateUserRequest>;
	readonly updateUser: Parser<UpdateUserRequest>;
	readonly rolesToUser: Parser<AddUserRolesRequest>;
	readonly createRole: Parser<CreateUserRoleRequest>;
	readonly deleteUser: Parser<DeleteUserRequest>;
}
