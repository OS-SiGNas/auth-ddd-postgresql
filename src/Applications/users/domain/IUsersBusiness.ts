import type { IUser } from "./IUser";
import type { UserDTO } from "../domain/users.dto.js";
import type { CreateUserRequest } from "./request/create-user.request";
import type { DeleteUserRequest } from "./request/delete-user.request";
import type { GetAllUsersRequest } from "./request/get-all-users.request";
import type { GetOneUserRequest } from "./request/get-one-user.request";
import type { UpdateUserRequest } from "./request/update-user.request";
import type { BusinessHandler } from "../../../Domain/business/Business";
import type { AddUserRolesRequest } from "./request/add-user-role.request";
import type { CreateUserRoleRequest } from "./request/create-user-roles.request";

export interface IUsersBusiness {
  readonly createUser: BusinessHandler<CreateUserRequest["body"], UserDTO>;
  readonly getOneUser: BusinessHandler<GetOneUserRequest["params"], UserDTO | null>;
  readonly getAllUsers: BusinessHandler<GetAllUsersRequest["params"], IUser[]>;
  readonly updateUser: BusinessHandler<UpdateUserRequest, boolean>;
  readonly createRole: BusinessHandler<CreateUserRoleRequest["body"], boolean>;
  readonly addUserRole: BusinessHandler<AddUserRolesRequest, UserDTO>;
  readonly deleteUser: BusinessHandler<DeleteUserRequest["params"], boolean>;
}
