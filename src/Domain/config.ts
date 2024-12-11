import { env, loadEnvFile } from "node:process";

export type Environment = "development" | "production" | "testing";
export type HttpService = "express" | "fastify";
export type LoggerService = "console" | "winston";

interface Secrets {
	NODE_ENV: Environment;
	LOGGER_SERVICE: LoggerService;
	THIS_URL: string;
	HTTP_SERVICE: HttpService;
	PORT: number;
	PG_HOST: string;
	PG_PORT: number;
	PG_USERNAME: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	PG_RETRY_TIME: number;
	JWT_ACCESS_SECRET_KEY: string;
	JWT_ACCESS_EXPIRED_TIME: string;
	JWT_REFRESH_SECRET_KEY: string;
	JWT_REFRESH_EXPIRED_TIME: string;
	JWT_AA_SECRET_KEY: string;
	JWT_AA_EXPIRED_TIME: string;
}

class Config {
	static #instance?: Config; // crazy singleton 🤡
	static get instance(): Readonly<Config> {
		return (this.#instance ??= new Config());
	}

	readonly #NODE_ENV: Environment;
	#cacheSecrets?: Secrets;

	private constructor() {
		this.#NODE_ENV = this.#getSecretFromDotEnv("NODE_ENV") as Environment;
		const _environments: Environment[] = ["development", "production", "testing"];
		if (!_environments.includes(this.#NODE_ENV)) throw this.#error("NODE_ENV", _environments);
		if (this.#NODE_ENV === "production") loadEnvFile(".env");
		if (this.#NODE_ENV === "development") loadEnvFile(".env.dev");
		if (this.#NODE_ENV === "testing") loadEnvFile(".env.test");
	}

	readonly #getSecretFromDotEnv = (target: keyof Secrets): Readonly<string> => {
		const _secret = env[String(target)];
		if (_secret === undefined || _secret.length === 0) throw this.#error(target);
		console.debug(`[DEBUG] ✓ ${target}`);
		return _secret;
	};

	readonly #error = (variable: keyof Secrets, cause?: unknown): Error => {
		console.error(`[ERROR] x ${variable}`);
		return new Error(`Environment Variable: \x1B[31m${variable}\x1B[39m is undefined or incompatible 💩`, { cause });
	};

	readonly #validateNumber = (target: string): number => {
		if (isNaN(+target)) throw this.#error(target as keyof Secrets, "Secret is NaN");
		return +target;
	};

	public get secrets(): Readonly<Secrets> {
		console.info("[INFO]  Loading secrets");

		const LOGGER_SERVICE = this.#getSecretFromDotEnv("LOGGER_SERVICE") as LoggerService;
		const _loggers: LoggerService[] = ["console", "winston"];
		if (!_loggers.includes(LOGGER_SERVICE)) throw this.#error("LOGGER_SERVICE", _loggers);

		const HTTP_SERVICE = this.#getSecretFromDotEnv("HTTP_SERVICE") as HttpService;
		const _httpServices: HttpService[] = ["express", "fastify"];
		if (!_httpServices.includes(HTTP_SERVICE)) throw this.#error("HTTP_SERVICE", _httpServices);

		return {
			NODE_ENV: this.#NODE_ENV,
			LOGGER_SERVICE,
			THIS_URL: this.#getSecretFromDotEnv("THIS_URL"),
			HTTP_SERVICE,
			PORT: this.#validateNumber(this.#getSecretFromDotEnv("PORT")),
			PG_HOST: this.#getSecretFromDotEnv("PG_HOST"),
			PG_PORT: this.#validateNumber(this.#getSecretFromDotEnv("PG_PORT")),
			PG_USERNAME: this.#getSecretFromDotEnv("PG_USERNAME"),
			PG_PASSWORD: this.#getSecretFromDotEnv("PG_PASSWORD"),
			PG_DATABASE: this.#getSecretFromDotEnv("PG_DATABASE"),
			PG_RETRY_TIME: this.#validateNumber(this.#getSecretFromDotEnv("PG_RETRY_TIME")),
			JWT_ACCESS_SECRET_KEY: this.#getSecretFromDotEnv("JWT_ACCESS_SECRET_KEY"),
			JWT_ACCESS_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_ACCESS_EXPIRED_TIME"),
			JWT_REFRESH_SECRET_KEY: this.#getSecretFromDotEnv("JWT_REFRESH_SECRET_KEY"),
			JWT_REFRESH_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_REFRESH_EXPIRED_TIME"),
			JWT_AA_SECRET_KEY: this.#getSecretFromDotEnv("JWT_AA_SECRET_KEY"),
			JWT_AA_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_AA_EXPIRED_TIME"),
		} as const;
	}

	public readonly getAsyncSecrets = async (): Promise<Readonly<Secrets>> => {
		if (this.#cacheSecrets === undefined) {
			/** Implement async handle secrets service
      const strategy = this.#getAsyncSecretStrategy('AWS')
      this.#cacheSecrets = await strategy() */
			this.#cacheSecrets = this.secrets;
		}
		return await Promise.resolve(this.#cacheSecrets);
	};

	get IS_DEBUG(): boolean {
		return this.#NODE_ENV !== "production";
	}
}

export const { secrets, getAsyncSecrets, IS_DEBUG } = Config.instance;
