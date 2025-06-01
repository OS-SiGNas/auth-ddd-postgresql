import { In } from "typeorm";
import { UserDTO } from "../domain/users.dto.js";
import { BadRequestException400, DuplicateAccountException409, NotFoundException404 } from "#Domain";

import type { BusinessDependencies, ILogger, IPasswordHandler } from "#Domain";
import type { IUsersBusiness } from "../domain/IUsersBusiness.js";
import type { UserRepository } from "../domain/entities/users.entity.js";
import type { RolesRepository } from "../domain/entities/roles.entity.js";

interface Dependencies extends BusinessDependencies {
	passwordHandler: IPasswordHandler;
}

export class UsersBusiness implements IUsersBusiness {
	readonly #usersRepository: UserRepository;
	readonly #rolesRepository: RolesRepository;
	readonly #passwordHandler: IPasswordHandler;
	readonly #logger: ILogger;

	constructor(d: Readonly<Dependencies>) {
		this.#usersRepository = d.modelRepository.get<UserRepository>("User");
		this.#rolesRepository = d.modelRepository.get<RolesRepository>("Role");
		this.#passwordHandler = d.passwordHandler;
		this.#logger = d.logger;
	}

	public readonly createRole: IUsersBusiness["createRole"] = async ({ name }) => {
		const schema = this.#rolesRepository.create({ name });
		const role = await this.#rolesRepository.save(schema);
		return role !== undefined;
	};

	public readonly createUser: IUsersBusiness["createUser"] = async (user) => {
		const exist = await this.#usersRepository.exists({ where: { email: user.email } });
		this.#logger.warn(`User ${user.email} exists?: ${exist}`);
		if (exist) throw new DuplicateAccountException409(user.email);
		this.#logger.info(`Creating user: ${user.email} with roles: ${user.roles}`);
		user.password = await this.#passwordHandler.encryptPassword(user.password);
		const roles = await this.#rolesRepository.find({ where: { name: In(user.roles) } });
		if (roles.length === 0) throw new BadRequestException400("These roles cannot be assigned");
		const schema = this.#usersRepository.create({ ...user, roles, isActive: true });
		const newUser = await this.#usersRepository.save(schema);
		return new UserDTO(newUser);
	};

	public readonly rolesToUser: IUsersBusiness["rolesToUser"] = async ({ params, body }) => {
		const roles = await this.#rolesRepository.find({ where: { id: In(body.roles) } });
		const user = await this.#usersRepository.findOneBy({ uuid: params.uuid });
		if (user === null) throw new NotFoundException404(`User ${params.uuid} not found`);
		user.roles = roles;
		const userUpdated = await this.#usersRepository.save(user);
		return new UserDTO(userUpdated);
	};

	public readonly getOneUser: IUsersBusiness["getOneUser"] = async ({ uuid }) => {
		const [user] = await this.#usersRepository.find({
			select: { uuid: true, name: true, email: true, createdAt: true },
			relations: ["roles"],
			where: { uuid },
		});

		if (user === undefined) throw new NotFoundException404(uuid);
		return new UserDTO(user);
	};

	public readonly getAllUsers: IUsersBusiness["getAllUsers"] = async ({ limit, offset }) => {
		const users = await this.#usersRepository.find({
			select: { uuid: true, name: true, email: true, createdAt: true, roles: { name: true } },
			where: {},
			relations: { roles: true },
			order: { createdAt: "DESC" },
			skip: offset,
			take: limit,
		});

		return {
			users: users.map((user) => new UserDTO(user).userNonSensitiveDTO),
			pagination: {
				total: users.length,
				offset: offset,
				limit: limit,
			},
		};
	};

	public readonly updateUser: IUsersBusiness["updateUser"] = async ({ params, body }) => {
		const updated = await this.#usersRepository.update({ uuid: params.uuid }, { ...body });
		return updated.affected !== undefined;
	};

	public readonly deleteUser: IUsersBusiness["deleteUser"] = async ({ uuid }) => {
		const deleted = await this.#usersRepository.delete({ uuid });
		return deleted.affected !== undefined;
	};
}
