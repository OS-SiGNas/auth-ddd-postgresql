import type { ISession, ITokenPayload } from "../../../Domain/business/ISession";
import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";
import type { IErrorHandler } from "../../../Domain/core/IErrorHandler";

// Errors
import { BadRequestException400, ForbiddenException403 } from "../../../Domain/core/errors.factory.js";
import { RoleName } from "../../users/domain/role-name.enum.js";

interface Dependences {
	accessTokenHandler: ITokenHandler<ITokenPayload>;
	refreshTokenHandler: ITokenHandler<ITokenPayload>;
	errorHandler: IErrorHandler;
}

export class _SessionHandler implements ISessionHandler {
	static #instance?: _SessionHandler;
	static readonly getInstance = (d: Readonly<Dependences>): _SessionHandler => (this.#instance ??= new _SessionHandler(d));
	// Errors
	readonly #malformedError = new BadRequestException400("Malformed authorization headers");
	readonly #forbiddenResourceError = new ForbiddenException403("Forbidden resource");
	readonly #invalidSessionError = new BadRequestException400("Invalid Session");
	readonly #sessionExpiredError = new ForbiddenException403("Session Expired");

	readonly #accessTokenHandler: ITokenHandler<ITokenPayload>;
	readonly #refreshTokenHandler: ITokenHandler<ITokenPayload>;
	readonly #errorHandler: IErrorHandler;
	private constructor(d: Readonly<Dependences>) {
		this.#accessTokenHandler = d.accessTokenHandler;
		this.#refreshTokenHandler = d.refreshTokenHandler;
		this.#errorHandler = d.errorHandler;
	}

	public readonly validateRefreshToken = async (refreshToken: string): Promise<ITokenPayload> =>
		await this.#refreshTokenHandler.verifyJWT(refreshToken);

	public readonly generateAccessToken = async (payload: ITokenPayload): Promise<string> =>
		await this.#accessTokenHandler.generateJWT(payload);

	public readonly generateSession = async (payload: ITokenPayload): Promise<ISession> => {
		const [accessToken, refreshToken] = await Promise.all([
			this.#accessTokenHandler.generateJWT(payload),
			this.#refreshTokenHandler.generateJWT(payload),
		]);

		return { accessToken, refreshToken };
	};

	public readonly validateSession = async (role: RoleName, Authorization?: string): Promise<ITokenPayload> => {
		try {
			if (Authorization === undefined) throw this.#malformedError;
			const token = this.#getTokenFromAuthorizationBearer(Authorization);
			const payload = await this.#accessTokenHandler.verifyJWT(token);
			if (!payload.roles.includes(role)) throw this.#forbiddenResourceError;
			return payload;
		} catch (error) {
			void this.#errorHandler.catch(this.constructor.name, error);
			if (error instanceof Error) {
				if (error.name === "TokenExpiredError") throw this.#sessionExpiredError;
				if (error.name === "JsonWebTokenError") throw this.#invalidSessionError;
				if (error.name === "invalid signature") throw this.#invalidSessionError;
			}
			throw error;
		}
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
