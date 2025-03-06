import type { RoleName } from "#users/v1/domain/role-name.enum.js";
import type { ISession, ITokenPayload } from "./ISession";

interface ISessionHandler {
	/**
	 * @param payload Business Token Payload  */
	readonly generateSession: (tokenPayload: ITokenPayload) => Promise<ISession>;
	readonly validateSession: (role: RoleName, bearerToken?: string) => Promise<ITokenPayload>;

	readonly generateAccessToken: (payload: ITokenPayload) => Promise<string>;
	readonly validateRefreshToken: (refreshToken: string) => Promise<ITokenPayload>;
	readonly validateApiKey: (apiKey: string) => boolean;
}
