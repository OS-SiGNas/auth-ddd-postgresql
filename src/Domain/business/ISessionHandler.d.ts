import type { Role } from "../../Applications/users/domain/entities/roles.entity.js";
import type { ISession, ITokenPayload } from "./ISession";

interface ISessionHandler {
  readonly validateSession: (role: Role, bearerToken?: string) => Promise<ITokenPayload>;
  readonly validateApiKey: (apiKey: string) => boolean;
  /**
   * @param payload Business Token Payload  */
  readonly generateSession: (tokenPayload: ITokenPayload) => Promise<ISession>;
}
