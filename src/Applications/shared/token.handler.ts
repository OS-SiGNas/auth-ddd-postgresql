// Errors
import { InternalServerException500 } from "../../Domain/core/errors.factory.js";

import type { sign, verify } from "jsonwebtoken";
import type { ILogger } from "../../Domain/core/ILogger";
import type { ITokenHandler } from "../../Domain/business/ITokenHandler";
import type { Core } from "../../Domain/core/Core.js";

interface Dependences extends Core {
	sign: typeof sign;
	verify: typeof verify;
	jwtSecretKey: string;
	jwtExpiredTime: string;
}

export class TokenHandler<Payload extends object> implements ITokenHandler<Payload> {
	readonly #logger: ILogger;
	readonly #sign: typeof sign;
	readonly #verify: typeof verify;
	readonly #jwtSecretKey: string;
	readonly #jwtExpiredTime: string;

	constructor(d: Readonly<Dependences>) {
		this.#logger = d.logger;
		this.#sign = d.sign;
		this.#verify = d.verify;
		this.#jwtExpiredTime = d.jwtExpiredTime;
		this.#jwtSecretKey = d.jwtSecretKey;
	}

	public readonly generateJWT = async (payload: Payload): Promise<string> => {
		return this.#sign(payload, this.#jwtSecretKey, { expiresIn: this.#jwtExpiredTime });
	};

	public readonly verifyJWT = async (token: string): Promise<Payload> => {
		const payload = this.#verify(token, this.#jwtSecretKey);
		if (typeof payload === "string") throw this.#handleStringError(payload, token);
		return Promise.resolve(payload) as Payload;
	};

	readonly #handleStringError = (payload: string, token: string): Error => {
		this.#logger.warn(`Jwt.verify returning string token: ${token} :: Payload: ${payload}`);
		return new InternalServerException500("Something went wrong while verifying token");
	};
}
