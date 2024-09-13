import { z } from "zod";
import { RoleName } from "./role-name.enum.js";
import type { Parser } from "../../../Domain/business/Business";
import type { IUsersRequestDTO } from "./IUsersRequestDTO";
import type { CreateUserRequest } from "./request/create-user.request";
import type { DeleteUserRequest } from "./request/delete-user.request";
import type { GetOneUserRequest } from "./request/get-one-user.request";
import type { UpdateUserRequest } from "./request/update-user.request";
import type { GetAllUsersRequest } from "./request/get-all-users.request";
import type { AddUserRolesRequest } from "./request/add-user-role.request";
import type { CreateUserRoleRequest } from "./request/create-user-roles.request";

const { ADMIN, MODERATOR, STANDARD, TESTER } = RoleName;
export class UsersRequestDTO implements IUsersRequestDTO {
	static defaults = {
		uuid: z.string().uuid(),
		token: z.string().regex(/^[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+$/),
		createdAt: z.date(),
		isActive: z.boolean(),
		name: z.string().min(8).max(32),
		email: z.string().email(),
		password: z.string().min(10).max(64),
		// .regex(/[A-Z]/, "La contraseña debe incluir al menos una mayúscula")
		// .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~-]/, "La contraseña debe incluir al menos un carácter especial"),
		role: z.enum([ADMIN, STANDARD, MODERATOR, TESTER]),
		roles: z.array(z.number()),
		hash: z.string().uuid(),
	} as const;

	public readonly getUser: Parser<GetOneUserRequest> = async (request) => {
		const { uuid } = UsersRequestDTO.defaults;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const schema = z.object({ query, params });
		return await schema.parseAsync(request);
	};

	public readonly getAllUsers: Parser<GetAllUsersRequest> = async (request) => {
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const schema = z.object({ query, params });
		return await schema.parseAsync(request);
	};

	public readonly createUser: Parser<CreateUserRequest> = async (request) => {
		const { name, password, email, role } = UsersRequestDTO.defaults;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const body = z.object({ name, password, email, roles: z.array(role) }).strict();
		const schema = z.object({ query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly updateUser: Parser<UpdateUserRequest> = async (request) => {
		const { uuid, createdAt, email, isActive, name } = UsersRequestDTO.defaults;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const body = z.object({ uuid, createdAt, email, isActive, name }).partial().strict();
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
		const schema = z.object({ query, params });
		return await schema.parseAsync(request);
	};
}
