import type { sign, verify } from "jsonwebtoken";
import type { ILogger } from "../../../Domain/core/ILogger";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";
import type { ITokenPayload } from "../../../Domain/business/ISession";
// Errors
import { InvalidJwtPayloadException } from "../../../Domain/core/errors.factory.js";

interface Dependences {
  logger: ILogger;
  sign: typeof sign;
  verify: typeof verify;
  jwtSecretKey: string;
  jwtExpiredTime: string;
}

export default class _TokenHandler implements ITokenHandler {
  static #instance?: _TokenHandler;
  static readonly getInstance = (d: Readonly<Dependences>): _TokenHandler => (this.#instance ??= new _TokenHandler(d));

  readonly #logger: ILogger;
  readonly #sign: typeof sign;
  readonly #verify: typeof verify;
  readonly #jwtSecretKey: string;
  readonly #jwtExpiredTime: string;

  private constructor(d: Readonly<Dependences>) {
    this.#logger = d.logger;
    this.#sign = d.sign;
    this.#verify = d.verify;
    this.#jwtExpiredTime = d.jwtExpiredTime;
    this.#jwtSecretKey = d.jwtSecretKey;
  }

  public readonly generateJWT = async <T extends object>(payload: T): Promise<string> => {
    return this.#sign(payload, this.#jwtSecretKey, { expiresIn: this.#jwtExpiredTime });
  };

  public readonly verifyJWT = async <T>(token: string): Promise<T> => {
    const payload = this.#verify(token, this.#jwtSecretKey) as ITokenPayload;
    if (typeof payload === "string") throw this.#handleStringError(payload);
    return Promise.resolve(payload) as T;
  };

  readonly #handleStringError = (payload: string): Error => {
    this.#logger.warn(payload);
    return new InvalidJwtPayloadException(`jwt.verify return ${payload} as payload`, 500);
  };
}
