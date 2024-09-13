import type { Parser } from "../../../Domain/business/Business";
import type { AddUserRolesRequest } from "./request/add-user-role.request";
import type { CreateUserRoleRequest } from "./request/create-user-roles.request";
import type { CreateUserRequest } from "./request/create-user.request";
import type { DeleteUserRequest } from "./request/delete-user.request";
import type { GetAllUsersRequest } from "./request/get-all-users.request";
import type { GetOneUserRequest } from "./request/get-one-user.request";
import type { UpdateUserRequest } from "./request/update-user.request";

export interface IUsersRequestDTO {
	readonly getUser: Parser<GetOneUserRequest>;
	readonly getAllUsers: Parser<GetAllUsersRequest>;
	readonly createUser: Parser<CreateUserRequest>;
	readonly updateUser: Parser<UpdateUserRequest>;
	readonly addUserRoles: Parser<AddUserRolesRequest>;
	readonly createRole: Parser<CreateUserRoleRequest>;
	readonly deleteUser: Parser<DeleteUserRequest>;
}
