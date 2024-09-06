import { In } from "typeorm";
import type { IPasswordHandler } from "../../../Domain/business/IPasswordHandler";
import type { ILogger } from "../../../Domain/core/ILogger";
import type { BusinessHandler } from "../../../Domain/business/Business";
import type { User } from "../domain/entities/users.entity.js";
import type { Role } from "../domain/entities/roles.entity";
import type { IUser } from "../domain/IUser";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
// Request
import type { CreateUserRequest } from "../domain/request/create-user.request";
import type { GetOneUserRequest } from "../domain/request/get-one-user.request";
import type { UpdateUserRequest } from "../domain/request/update-user.request";
import type { DeleteUserRequest } from "../domain/request/delete-user.request";
import type { CreateUserRoleRequest } from "../domain/request/create-user-roles.request";
import type { AddUserRolesRequest } from "../domain/request/add-user-role.request";

import { UserDTO } from "../domain/users.dto.js";
import { DuplicateAccountException, NotFoundException404 } from "../../../Domain/core/errors.factory.js";

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
    const exist = await this.#usersRepository.exists({ where: { name: user.email } });
    if (exist === true) throw new DuplicateAccountException("Duplicate Account");
    user.password = await this.#passwordHandler.encryptPassword(user.password);
    const schema = this.#usersRepository.create({ ...user });
    this.#logger.debug(schema);
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

  public readonly getOneUser = async ({ uuid }: GetOneUserRequest["params"]): Promise<UserDTO | null> => {
    const user = await this.#usersRepository.findOneBy({ uuid });
    this.#logger.debug(user);
    if (user === null) return null;
    return new UserDTO(user);
  };

  public readonly getAllUsers = async (): Promise<IUser[]> => {
    return await this.#usersRepository.find();
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
