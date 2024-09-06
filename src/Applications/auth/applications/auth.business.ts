import { randomBytes } from "crypto";

import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { IStorageHandler } from "../../../Domain/IStorageHandler";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";
import type { IPasswordHandler } from "../../../Domain/business/IPasswordHandler";
import type { IAuthBusiness } from "../domain/IAuthBusiness";
import type { LoginRequest } from "../domain/request/login.request";
import type { RegisterRequest } from "../domain/request/register.request";
import type { ActivateAccountRequest } from "../domain/request/activate-account.request";
import type { ForgotPasswordRequest } from "../domain/request/forgot-password.request";
import type { ChangePasswordRequest } from "../domain/request/change-password.request";
import type { User } from "../../users/domain/entities/users.entity.js";

import { ForbiddenException403, UserNotFoundException } from "../../../Domain/core/errors.factory.js";
import { UserDTO } from "../../users/domain/users.dto.js";

interface Dependences {
  repository: typeof User;
  passwordHandler: IPasswordHandler;
  sessionHandler: ISessionHandler;
  tokenHandler: ITokenHandler;
  storage: IStorageHandler;
}

export class AuthBusiness implements IAuthBusiness {
  readonly #repository: typeof User;
  readonly #sessionHandler: ISessionHandler;
  readonly #passwordHandler: IPasswordHandler;
  readonly #tokenHandler: ITokenHandler;
  readonly #storage: IStorageHandler;

  constructor(d: Readonly<Dependences>) {
    this.#repository = d.repository;
    this.#passwordHandler = d.passwordHandler;
    this.#sessionHandler = d.sessionHandler;
    this.#tokenHandler = d.tokenHandler;
    this.#storage = d.storage;
  }

  public readonly login = async ({ email, password }: LoginRequest["body"]): Promise<UserDTO | null> => {
    const user = await this.#repository.findOneBy({ email });
    if (user === null) return null;
    const isMatch = await this.#passwordHandler.comparePassword(password, user.password);
    if (isMatch === false) return null;
    console.log(user);
    if (user.isActive === false) throw new ForbiddenException403("Inactive account");
    const dto = new UserDTO(user);
    dto.session = await this.#sessionHandler.generateSession({ roles: user.roles, userUuid: user.uuid });
    return dto;
  };

  public readonly register = async ({ email, name, password }: RegisterRequest["body"]): Promise<UserDTO> => {
    const exists = await this.#repository.exists({ where: { email } });
    if (exists) throw new Error("Duplicate Account");
    const encryptedPassword = await this.#passwordHandler.encryptPassword(password);
    const schema = new this.#repository();
    schema.email = email;
    schema.name = name;
    schema.password = encryptedPassword;
    const user = await this.#repository.save(schema);
    if (user !== undefined) this.#storage.set(user.email, await this.#tokenHandler.generateJWT({ email }));
    return new UserDTO(user);
  };

  public readonly activateAccount = async ({ token }: ActivateAccountRequest["params"]): Promise<boolean> => {
    const { email } = await this.#tokenHandler.verifyJWT<{ email: string }>(token);
    const user = await this.#repository.findOneBy({ email });
    if (user === null) return false;
    const storage = await this.#storage.get<{ token: string }>(user.email);
    if (storage === null) return false;
    if (storage.token !== token) return false;
    user.isActive = true;
    await this.#repository.save(user);
    return true;
  };

  public readonly forgotPassword = async ({ email }: ForgotPasswordRequest["body"]): Promise<string> => {
    const user = await this.#repository.findOneBy({ email });
    if (user === null) throw new UserNotFoundException(email);
    const verificationString = randomBytes(4).toString("hex");
    await this.#storage.set(email, { verificationString: await this.#passwordHandler.encryptPassword(verificationString) });
    // await this.notificationService.sendEmailWithChangePassword({email, verificationString})
    return verificationString;
  };

  public readonly changePassword = async ({ email, newPassword, verificationString }: ChangePasswordRequest["body"]): Promise<boolean> => {
    const storage = await this.#storage.get<{ verificationString: string }>(email);
    if (storage === null) return false;
    const isMatch = await this.#passwordHandler.comparePassword(verificationString, storage.verificationString);
    if (isMatch === false) return false;
    const updated = await this.#repository.update({ email }, { password: await this.#passwordHandler.encryptPassword(newPassword) });
    if (updated.affected === undefined) return false;
    return true;
  };
}
