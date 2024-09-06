import { z } from "zod";
import type { Parser } from "../../../Domain/business/Business";
import type { IUsersRequestDTO } from "./IUsersRequestDTO";
import type { CreateUserRequest } from "./request/create-user.request";
import type { DeleteUserRequest } from "./request/delete-user.request";
import type { GetOneUserRequest } from "./request/get-one-user.request";
import type { UpdateUserRequest } from "./request/update-user.request";
import type { GetAllUsersRequest } from "./request/get-all-users.request";
import type { AddUserRolesRequest } from "./request/add-user-role.request";
import type { CreateUserRoleRequest } from "./request/create-user-roles.request";

export class UsersRequestDTO implements IUsersRequestDTO {
  static defaults = {
    uuid: z.string().uuid(),
    createdAt: z.date(),
    isActive: z.boolean(),
    name: z.string().min(8).max(32),
    email: z.string().email(),
    password: z.string().min(10).max(64),
    role: z.string(),
    roles: z.array(z.number()),
    hash: z.string().uuid(),
  } as const;

  public readonly getUser: Parser<GetOneUserRequest> = async (request) => {
    const { uuid } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({ uuid }).strict();
    const body = z.object({}).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly getAllUsers: Parser<GetAllUsersRequest> = async (request) => {
    const query = z.object({}).strict();
    const params = z.object({}).strict();
    const body = z.object({}).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly createUser: Parser<CreateUserRequest> = async (request) => {
    const { name, password, email } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({}).strict();
    const body = z.object({ name, password, email }).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly updateUser: Parser<UpdateUserRequest> = async (request) => {
    const { uuid, createdAt, email, isActive, name, password } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({ uuid }).strict();
    const body = z.object({ uuid, createdAt, email, isActive, name, password }).partial();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly createRole: Parser<CreateUserRoleRequest> = async (request) => {
    const { role } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({}).strict();
    const body = z.object({ name: role }).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly addUserRoles: Parser<AddUserRolesRequest> = async (request) => {
    const { uuid, roles } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({ uuid }).strict();
    const body = z.object({ roles }).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };

  public readonly deleteUser: Parser<DeleteUserRequest> = async (request) => {
    const { uuid } = UsersRequestDTO.defaults;
    const query = z.object({}).strict();
    const params = z.object({ uuid }).strict();
    const body = z.object({}).strict();
    const schema = z.object({ query, params, body });
    return await schema.parseAsync(request);
  };
}
