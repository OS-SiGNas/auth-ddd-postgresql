import { In } from "typeorm";
import type { IPasswordHandler } from "../../../Domain/business/IPasswordHandler";
import type { ILogger } from "../../../Domain/core/ILogger";
import type { BusinessHandler } from "../../../Domain/business/Business";
import type { User } from "../domain/entities/users.entity.js";
import type { Role } from "../domain/entities/roles.entity";
import type { UserNonSensitiveData } from "../domain/IUser";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
// Request
import type { CreateUserRequest } from "../domain/request/create-user.request";
import type { GetOneUserRequest } from "../domain/request/get-one-user.request";
import type { UpdateUserRequest } from "../domain/request/update-user.request";
import type { DeleteUserRequest } from "../domain/request/delete-user.request";
import type { CreateUserRoleRequest } from "../domain/request/create-user-roles.request";
import type { AddUserRolesRequest } from "../domain/request/add-user-role.request";

import { UserDTO } from "../domain/users.dto.js";
import {
	BadRequestException400,
	DuplicateAccountException,
	NotFoundException404,
	UserNotFoundException,
} from "../../../Domain/core/errors.factory.js";
import { GetAllUsersRequest } from "../domain/request/get-all-users.request";

interface Dependences {
	usersRepository: typeof User;
	rolesRepository: typeof Role;
	passwordHandler: IPasswordHandler;
	logger: ILogger;
}

export class UsersBusiness implements IUsersBusiness {
	readonly #usersRepository: typeof User;
	readonly #rolesRepository: typeof Role;
	readonly #passwordHandler: IPasswordHandler;
	readonly #logger: ILogger;

	constructor(d: Readonly<Dependences>) {
		this.#usersRepository = d.usersRepository;
		this.#rolesRepository = d.rolesRepository;
		this.#passwordHandler = d.passwordHandler;
		this.#logger = d.logger;
	}

	public readonly createRole: BusinessHandler<CreateUserRoleRequest["body"], boolean> = async ({ name }) => {
		const schema = this.#rolesRepository.create({ name });
		const role = await this.#rolesRepository.save(schema);
		return role !== undefined;
	};

	public readonly createUser: BusinessHandler<CreateUserRequest["body"], UserDTO> = async (user) => {
		const exist = await this.#usersRepository.exists({ where: { email: user.email } });
		this.#logger.warn(`User ${user.email} exists?: ${exist}`);
		if (exist) throw new DuplicateAccountException(user.email);
		this.#logger.info(`Creating user: ${user.email} with roles: ${user.roles}`);
		user.password = await this.#passwordHandler.encryptPassword(user.password);
		const roles = await this.#rolesRepository.find({ where: { name: In(user.roles) } });
		this.#logger.debug(roles);
		if (roles.length === 0) throw new BadRequestException400("These roles cannot be assigned");
		const schema = this.#usersRepository.create({ ...user, roles, isActive: true });
		const newUser = await this.#usersRepository.save(schema);
		return new UserDTO(newUser);
	};

	public readonly addUserRole: BusinessHandler<AddUserRolesRequest, UserDTO> = async ({ params, body }) => {
		const roles = await this.#rolesRepository.find({ where: { id: In(body.roles) } });
		const user = await this.#usersRepository.findOneBy({ uuid: params.uuid });
		if (user === null) throw new NotFoundException404(`User ${params.uuid} not found`);
		user.roles = roles;
		const userUpdated = await this.#usersRepository.save(user);
		return new UserDTO(userUpdated);
	};

	public readonly getOneUser: BusinessHandler<GetOneUserRequest["params"], UserDTO> = async ({ uuid }) => {
		const [user] = await this.#usersRepository.find({
			where: { uuid },
			select: { uuid: true, name: true, email: true, createdAt: true },
			relations: ["roles"],
		});
		if (user === undefined) throw new UserNotFoundException(uuid);
		return new UserDTO(user);
	};

	public readonly getAllUsers: BusinessHandler<GetAllUsersRequest["query"], UserNonSensitiveData[]> = async () => {
		const users = await this.#usersRepository.find({
			where: {},
			select: { uuid: true, name: true, email: true, createdAt: true, roles: { name: true } },
			relations: { roles: true },
		});
		return users.map((user) => new UserDTO(user).userNonSensitiveDTO);
	};

	public readonly updateUser: BusinessHandler<UpdateUserRequest, boolean> = async ({ params, body }) => {
		const updated = await this.#usersRepository.update({ uuid: params.uuid }, { ...body });
		this.#logger.debug(updated);
		return updated.affected !== undefined;
	};

	public readonly deleteUser = async ({ uuid }: DeleteUserRequest["params"]): Promise<boolean> => {
		const deleted = await this.#usersRepository.delete({ uuid });
		this.#logger.debug(deleted);
		return deleted.affected !== undefined;
	};
}
