import { config as dotEnvConfig } from "dotenv";
import { Logger } from "../Applications/shared/logger-handler/logger.js";

export type Environment = "development" | "production" | "test";
type Variables =
	| "HTTP_SERVICE"
	| "PORT"
	| "PG_HOST"
	| "PG_PORT"
	| "PG_USERNAME"
	| "PG_PASSWORD"
	| "PG_DATABASE"
	| "JWT_ACCESS_SECRET_KEY"
	| "JWT_ACCESS_EXPIRED_TIME"
	| "JWT_REFRESH_SECRET_KEY"
	| "JWT_REFRESH_EXPIRED_TIME"
	| "JWT_AA_SECRET_KEY"
	| "JWT_AA_EXPIRED_TIME";

type HttpService = "express" | "fastify";
type Secrets = Readonly<Record<Variables, string>>;

class System {
	readonly #environment: Environment;
	readonly #logger = new Logger(System.name);

	private constructor() {
		dotEnvConfig();
		this.#environment = process.env["ENVIRONMENT"] as Environment;
	}

	static #instance?: System; // crazy singleton 🤡
	static get instance(): Readonly<System> {
		if (this.#instance === undefined) this.#instance = new System();
		return this.#instance;
	}

	readonly #error = (variable: Variables): Error => new Error(`💩 Environment Variable: \x1B[31m${variable}\x1B[39m is undefined`);
	readonly #getSecretFromDotEnv = (variable: Variables): Readonly<string> => {
		const target = process.env[variable];
		if (target === undefined) throw this.#error(variable);
		this.#logger.debug(`✓ ${variable}`);
		return target;
	};

	public get secrets(): Secrets {
		return {
			HTTP_SERVICE: this.#getSecretFromDotEnv("HTTP_SERVICE") as HttpService,
			PORT: this.#getSecretFromDotEnv("PORT"),
			PG_HOST: this.#getSecretFromDotEnv("PG_HOST"),
			PG_PORT: this.#getSecretFromDotEnv("PG_PORT"),
			PG_USERNAME: this.#getSecretFromDotEnv("PG_USERNAME"),
			PG_PASSWORD: this.#getSecretFromDotEnv("PG_PASSWORD"),
			PG_DATABASE: this.#getSecretFromDotEnv("PG_DATABASE"),
			JWT_ACCESS_SECRET_KEY: this.#getSecretFromDotEnv("JWT_ACCESS_SECRET_KEY"),
			JWT_ACCESS_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_ACCESS_EXPIRED_TIME"),
			JWT_REFRESH_SECRET_KEY: this.#getSecretFromDotEnv("JWT_REFRESH_SECRET_KEY"),
			JWT_REFRESH_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_REFRESH_EXPIRED_TIME"),
			JWT_AA_SECRET_KEY: this.#getSecretFromDotEnv("JWT_AA_SECRET_KEY"),
			JWT_AA_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_AA_EXPIRED_TIME"),
		} as const;
	}

	#cacheSecrets?: Secrets;
	public readonly getAsyncSecrets = async (): Promise<Secrets> => {
		if (this.#cacheSecrets === undefined) {
			/** Implement async handle secrets service
      const strategy = this.#getAsyncSecretStrategy('AWS')
      this.#cacheSecrets = await strategy() */
			this.#cacheSecrets = this.secrets;
		}

		return await Promise.resolve(this.#cacheSecrets);
	};

	get ENVIRONMENT(): Environment {
		return this.#environment;
	}
}

export const { secrets, getAsyncSecrets, ENVIRONMENT } = System.instance;
