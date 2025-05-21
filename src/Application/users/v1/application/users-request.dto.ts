import { z } from "zod";
import { RoleName } from "../domain/role-name.enum.js";

import { RequestSchemas } from "#Domain";
import type { AsyncParser } from "#Domain";
import type { IUsersRequestDTO } from "../domain/IUsersRequestDTO";
import type {
	AddUserRolesRequest,
	CreateUserRequest,
	CreateUserRoleRequest,
	DeleteUserRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
} from "../domain/Request";

// .regex(/[A-Z]/, "La contraseña debe incluir al menos una mayúscula")
// .regex(/[!@#$%^&*()_+{}[\]:;<>,.?~-]/, "La contraseña debe incluir al menos un carácter especial"),

export class UsersRequestDTO implements IUsersRequestDTO {
	static readonly #roles = z.enum([RoleName.ADMIN, RoleName.STANDARD, RoleName.MODERATOR, RoleName.TESTER]);
	static readonly defaults = {
		uuid: z.string().uuid(),
		token: z.string().regex(/^[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+\.[A-Za-z0-9\-_.]+$/),
		name: z
			.string()
			.min(8)
			.max(32)
			// .regex(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/, "Invalid name")
			.toLowerCase(),
		email: z.string().email().toLowerCase(),
		password: z.string().min(10).max(30),
		role: this.#roles,
		roles: z.array(z.number()),
		rolesArr: z.array(this.#roles),
		hash: z.string().uuid(),
	} as const;

	public readonly getOneUser: AsyncParser<GetOneUserRequest> = async (request) => {
		const { uuid } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const schema = z.object({ correlationId, headers, query, params });
		return await schema.parseAsync(request);
	};

	public readonly getAllUsers: AsyncParser<GetAllUsersRequest> = async (request) => {
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const schema = z.object({ correlationId, headers, query, params });
		return await schema.parseAsync(request);
	};

	public readonly createUser: AsyncParser<CreateUserRequest> = async (request) => {
		const { name, password, email, role } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const body = z.object({ name, password, email, roles: z.array(role) }).strict();
		const schema = z.object({ correlationId, headers, query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly updateUser: AsyncParser<UpdateUserRequest> = async (request) => {
		const { uuid, email, name } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const body = z.object({ uuid, email, name }).partial().strict();
		const schema = z.object({ correlationId, headers, query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly createRole: AsyncParser<CreateUserRoleRequest> = async (request) => {
		const { role } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({}).strict();
		const body = z.object({ name: role }).strict();
		const schema = z.object({ correlationId, headers, query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly rolesToUser: AsyncParser<AddUserRolesRequest> = async (request) => {
		const { uuid, roles } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const body = z.object({ roles }).strict();
		const schema = z.object({ correlationId, headers, query, params, body });
		return await schema.parseAsync(request);
	};

	public readonly deleteUser: AsyncParser<DeleteUserRequest> = async (request) => {
		const { uuid } = UsersRequestDTO.defaults;
		const { headers, correlationId } = RequestSchemas;
		const query = z.object({}).strict();
		const params = z.object({ uuid }).strict();
		const schema = z.object({ correlationId, headers, query, params });
		return await schema.parseAsync(request);
	};
}
