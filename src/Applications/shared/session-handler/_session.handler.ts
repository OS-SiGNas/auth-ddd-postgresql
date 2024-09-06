import type { Role } from "../../users/domain/entities/roles.entity.js";
import type { ISession, ITokenPayload } from "../../../Domain/business/ISession";
import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";
import type { IErrorHandler } from "../../../Domain/core/IErrorHandler";

// Errors
import { BadRequestException400, ForbiddenException403 } from "../../../Domain/core/errors.factory.js";

interface Dependences {
  tokenHandler: ITokenHandler;
  errorHandler: IErrorHandler;
}

export default class _SessionHandler implements ISessionHandler {
  static #instance?: _SessionHandler;
  static readonly getInstance = (d: Readonly<Dependences>): _SessionHandler => (this.#instance ??= new _SessionHandler(d));

  // Errors
  readonly #forbiddenResourceError = new ForbiddenException403("Forbidden resource");
  readonly #malformedError = new BadRequestException400("Malformed authorization headers");
  readonly #invalidSessionError = new BadRequestException400("Invalid Session");
  readonly #sessionExpiredError = new ForbiddenException403("Session Expired");

  readonly #tokenHandler: ITokenHandler;
  readonly #errorHandler: IErrorHandler;
  private constructor(d: Readonly<Dependences>) {
    this.#tokenHandler = d.tokenHandler;
    this.#errorHandler = d.errorHandler;
  }

  public readonly validateSession = async (role: Role, bearerToken?: string): Promise<ITokenPayload> => {
    try {
      if (bearerToken === undefined) throw this.#malformedError;
      const token = this.#getTokenFromAuthorizationBearer(bearerToken);
      const payload = await this.#tokenHandler.verifyJWT<ITokenPayload>(token);
      if (!payload.roles.includes(role)) throw this.#forbiddenResourceError;
      return payload;
    } catch (error) {
      void this.#errorHandler.catch(this.constructor.name, error);
      if (error instanceof Error) {
        if (error.name === "JsonWebTokenError") throw this.#invalidSessionError;
        if (error.name === "TokenExpiredError") throw this.#sessionExpiredError;
      }
      throw error;
    }
  };

  // TODO: Implementar toda la lógica para generar el refresh token
  public readonly generateSession = async (payload: ITokenPayload): Promise<ISession> => {
    const { generateJWT } = this.#tokenHandler;
    const [accessToken, refreshToken] = await Promise.all([generateJWT(payload), generateJWT(payload)]);
    return Promise.resolve({
      accessToken,
      refreshToken,
      accessTokenExpiresIn: 3600,
      refreshTokenExpiresIn: 6000,
    });
  };

  readonly #getTokenFromAuthorizationBearer = (authorization: string): string => {
    if (!authorization.includes("Bearer ")) throw this.#malformedError;
    const token = authorization.split(" ").pop();
    if (token === undefined) throw this.#malformedError;
    return token;
  };

  public readonly validateApiKey = (apiKey: string): boolean => {
    if (apiKey !== "") return false;
    else return true;
  };
}
