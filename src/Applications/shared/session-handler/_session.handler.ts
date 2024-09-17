// Errors
import { BadRequestException400, ForbiddenException403 } from "../../../Domain/core/errors.factory.js";
import { RoleName } from "../../users/domain/role-name.enum.js";

import type { ISession, ITokenPayload } from "../../../Domain/business/ISession";
import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";

interface Dependences {
	accessTokenHandler: ITokenHandler<ITokenPayload>;
	refreshTokenHandler: ITokenHandler<ITokenPayload>;
}

export class _SessionHandler implements ISessionHandler {
	static #instance?: _SessionHandler;
	static readonly getInstance = (d: Readonly<Dependences>): _SessionHandler => (this.#instance ??= new _SessionHandler(d));

	readonly #accessTokenHandler: ITokenHandler<ITokenPayload>;
	readonly #refreshTokenHandler: ITokenHandler<ITokenPayload>;
	private constructor(d: Readonly<Dependences>) {
		this.#accessTokenHandler = d.accessTokenHandler;
		this.#refreshTokenHandler = d.refreshTokenHandler;
	}

	public readonly generateAccessToken = async (payload: ITokenPayload): Promise<string> => {
		return await this.#accessTokenHandler.generateJWT(payload);
	};

	public readonly generateSession = async (payload: ITokenPayload): Promise<ISession> => {
		const [accessToken, refreshToken] = await Promise.all([
			this.#accessTokenHandler.generateJWT(payload),
			this.#refreshTokenHandler.generateJWT(payload),
		]);
		return { accessToken, refreshToken };
	};

	public readonly validateSession = async (role: RoleName, Authorization?: string): Promise<ITokenPayload> => {
		try {
			if (Authorization === undefined) throw this.#malformedError();
			const token = this.#getTokenFromAuthorizationBearer(Authorization);
			const payload = await this.#accessTokenHandler.verifyJWT(token);
			if (!payload.roles.includes(role)) throw this.#forbiddenResourceError();
			return payload;
		} catch (error) {
			return this.#handleJwtErrors(error);
		}
	};

	readonly #getTokenFromAuthorizationBearer = (authorization: string): string => {
		if (!authorization.includes("Bearer ")) throw this.#malformedError();
		const token = authorization.split(" ").pop();
		if (token === undefined) throw this.#malformedError();
		return token;
	};

	public readonly validateRefreshToken = async (refreshToken: string): Promise<ITokenPayload> => {
		try {
			return await this.#refreshTokenHandler.verifyJWT(refreshToken);
		} catch (error) {
			return this.#handleJwtErrors(error);
		}
	};

	// TODO: implement authentication flow by api key
	public readonly validateApiKey = (apiKey: string): boolean => {
		if (apiKey !== "") return false;
		else return true;
	};

	// Errors
	readonly #malformedError = (): Error => new BadRequestException400("Malformed authorization headers");
	readonly #forbiddenResourceError = (): Error => new ForbiddenException403("Insufficient credentials");
	readonly #invalidSessionError = (): Error => new BadRequestException400("Invalid session");
	readonly #sessionExpiredError = (): Error => new ForbiddenException403("Session expired");

	readonly #handleJwtErrors = (error: unknown): never => {
		if (error instanceof Error) {
			if (error.name === "TokenExpiredError") throw this.#sessionExpiredError();
			if (error.name === "JsonWebTokenError") throw this.#invalidSessionError();
			if (error.name === "invalid signature") throw this.#invalidSessionError();
		}
		throw error;
	};
}
