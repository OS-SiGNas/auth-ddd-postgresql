import { env, loadEnvFile } from "node:process";
import { z } from "zod";
import { Logger } from "#shared/logger-handler/make.js";

export type Environment = "development" | "production" | "test";
export type HttpService = "express" | "fastify";
export type LoggerService = "console" | "winston";

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

class Config {
	private constructor() {}
	static #instance?: Config; // crazy singleton 🤡
	static get instance(): Readonly<Config> {
		return (this.#instance ??= new Config());
	}

	readonly #logger = new Logger(this.constructor.name);

	readonly #error = (variable: keyof Secrets): Error => {
		this.#logger.error(`x ${variable}`);
		return new Error(`Environment Variable: \x1B[31m${variable}\x1B[39m is undefined or incompatible 💩`);
	};

	readonly #getSecretFromDotEnv = (target: keyof Secrets): Readonly<string> => {
		const variable = env[String(target)];
		if (variable === undefined) throw this.#error(target);
		this.#logger.debug(`✓ ${target}`);
		return variable;
	};

	readonly #validateNumber = (target: string): number => {
		if (isNaN(+target)) throw this.#error(target as keyof Secrets);
		return +target;
	};

	readonly #zodConfig = z.object({
		NODE_ENV: z.enum(["production", "development", "test"]),
		THIS_URL: z.string().url(),
		HTTP_SERVICE: z.enum(["fastify", "express"]),
		PORT: z.number().min(3000).max(65535),
		PG_HOST: z.string(),
		PG_PORT: z.number().min(3000).max(65535),
		PG_USERNAME: z.string(),
		PG_PASSWORD: z.string(),
		PG_DATABASE: z.string(),
		JWT_ACCESS_SECRET_KEY: z.string(),
		JWT_ACCESS_EXPIRED_TIME: z.string(),
		JWT_REFRESH_SECRET_KEY: z.string(),
		JWT_REFRESH_EXPIRED_TIME: z.string(),
		JWT_AA_SECRET_KEY: z.string(),
		JWT_AA_EXPIRED_TIME: z.string(),
	});

	public get secrets(): Readonly<Secrets> {
		this.#logger.info("Loading secrets");
		const NODE_ENV = this.#getSecretFromDotEnv("NODE_ENV") as Environment;
		if (NODE_ENV === "production") loadEnvFile(".env");
		if (NODE_ENV === "development") loadEnvFile(".env.dev");
		if (NODE_ENV === "test") loadEnvFile(".env.test");

		const secrets = {
			NODE_ENV,
			THIS_URL: this.#getSecretFromDotEnv("THIS_URL"),
			HTTP_SERVICE: this.#getSecretFromDotEnv("HTTP_SERVICE") as HttpService,
			PORT: this.#validateNumber(this.#getSecretFromDotEnv("PORT")),
			PG_HOST: this.#getSecretFromDotEnv("PG_HOST"),
			PG_PORT: this.#validateNumber(this.#getSecretFromDotEnv("PG_PORT")),
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

		return this.#zodConfig.parse(secrets);
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

	get IS_DEBUG(): boolean {
		return this.secrets.NODE_ENV !== "production";
	}
}

export const { secrets, getAsyncSecrets, IS_DEBUG } = Config.instance;
export default Config.instance;
