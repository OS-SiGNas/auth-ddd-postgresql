// Errors
import { InternalServerException500 } from "#Domain/errors/error.factory.js";

import type { sign, verify, SignOptions } from "jsonwebtoken";
import type { ILogger } from "#Domain/core/ILogger";
import type { ITokenHandler } from "#Domain/tools/ITokenHandler";
import type { Core } from "#Domain/core/Core.js";

interface Dependencies extends Core {
	sign: typeof sign;
	verify: typeof verify;
	jwtSecretKey: string;
	jwtExpiredTime: number;
}

export class TokenHandler<Payload extends object> implements ITokenHandler<Payload> {
	readonly #logger: ILogger;
	readonly #sign: typeof sign;
	readonly #verify: typeof verify;
	readonly #jwtSecretKey: string;
	readonly #signOptions: SignOptions;

	constructor(d: Readonly<Dependencies>) {
		this.#logger = d.logger;
		this.#sign = d.sign;
		this.#verify = d.verify;
		this.#jwtSecretKey = d.jwtSecretKey;
		this.#signOptions = { expiresIn: d.jwtExpiredTime };
	}

	public readonly generateJWT = async (payload: Payload): Promise<string> => {
		return await Promise.resolve(this.#sign(payload, this.#jwtSecretKey, this.#signOptions));
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
