import type { ISession } from "../../../Domain/business/ISession";
import type { IUser, UserNonSensitiveData } from "../domain/IUser";
import type { Role } from "./entities/roles.entity";

export interface UserSessionDTO {
  session: ISession;
  user: UserNonSensitiveData;
}

export class UserDTO {
  readonly #uuid: string;
  readonly #email: string;
  readonly #name: string;
  readonly #createdAt: Date;
  readonly #roles: Role[];

  constructor(user: IUser) {
    this.#uuid = user.uuid;
    this.#email = user.email;
    this.#name = user.name;
    this.#createdAt = user.createdAt;
    this.#roles = user.roles;
  }

  get uuid(): string {
    return this.#uuid;
  }

  get roles(): Role[] {
    return this.#roles;
  }

  #session?: ISession;
  set session(session: ISession) {
    this.#session = session;
  }

  get userNonSensitiveDTO(): UserNonSensitiveData {
    return {
      uuid: this.#uuid,
      name: this.#name,
      email: this.#email,
      roles: this.#roles,
      createdAt: this.#createdAt,
    };
  }

  get userSessionDTO(): UserSessionDTO {
    if (this.#session === undefined) throw new Error("Can't get UserSessionDTO, session is undefined");
    return {
      session: this.#session,
      user: this.userNonSensitiveDTO,
    } as const;
  }
}
