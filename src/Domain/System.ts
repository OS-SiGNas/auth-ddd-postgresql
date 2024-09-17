import { Logger } from "../Applications/shared/logger-handler/logger.js";

export type Environment = "development" | "production" | "test";
export type HttpService = "express" | "fastify";
interface Secrets {
	NODE_ENV: Environment;
	THIS_URL: string;
	HTTP_SERVICE: HttpService;
	PORT: number;
	PG_HOST: string;
	PG_PORT: number;
	PG_USERNAME: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	JWT_ACCESS_SECRET_KEY: string;
	JWT_ACCESS_EXPIRED_TIME: string;
	JWT_REFRESH_SECRET_KEY: string;
	JWT_REFRESH_EXPIRED_TIME: string;
	JWT_AA_SECRET_KEY: string;
	JWT_AA_EXPIRED_TIME: string;
}

class System {
	private constructor() {}
	static #instance?: System; // crazy singleton 🤡
	static get instance(): Readonly<System> {
		return (this.#instance ??= new System());
	}

	readonly #logger = new Logger(this.constructor.name);
	readonly #error = (variable: keyof Secrets): Error => {
		this.#logger.error(`x ${variable}`);
		return new Error(`💩 Environment Variable: \x1B[31m${variable}\x1B[39m is undefined`);
	};

	readonly #getSecretFromDotEnv = (variable: keyof Secrets): Readonly<string> => {
		const target = process.env[variable];
		if (target === undefined) throw this.#error(variable);
		this.#logger.debug(`✓ ${variable}`);
		return target;
	};

	public get secrets(): Readonly<Secrets> {
		this.#logger.info("Loading secrets");
		return {
			NODE_ENV: this.#getSecretFromDotEnv("NODE_ENV") as Environment,
			THIS_URL: this.#getSecretFromDotEnv("THIS_URL"),
			HTTP_SERVICE: this.#getSecretFromDotEnv("HTTP_SERVICE") as HttpService,
			PORT: +this.#getSecretFromDotEnv("PORT"),
			PG_HOST: this.#getSecretFromDotEnv("PG_HOST"),
			PG_PORT: +this.#getSecretFromDotEnv("PG_PORT"),
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
	public readonly getAsyncSecrets = async (): Promise<Readonly<Secrets>> => {
		if (this.#cacheSecrets === undefined) {
			/** Implement async handle secrets service
      const strategy = this.#getAsyncSecretStrategy('AWS')
      this.#cacheSecrets = await strategy() */
			this.#cacheSecrets = this.secrets;
		}

		return await Promise.resolve(this.#cacheSecrets);
	};

	get isDebug(): boolean {
		return secrets.NODE_ENV !== "production";
	}
}

export const { secrets, getAsyncSecrets, isDebug } = System.instance;
