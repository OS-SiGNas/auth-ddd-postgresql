import { env, loadEnvFile } from "node:process";
import { styleText } from "node:util";
import { secretsParser } from "./Application/config/secrets.parser.js";

export interface RabbitMQSecrets {
	RABBIT_QUEUE: string;
	RABBIT_PORT: number;
	RABBIT_HOSTNAME: string;
	RABBIT_PROTOCOL: string;
	RABBIT_USERNAME: string;
	RABBIT_PASSWORD: string;
	RABBIT_VHOST: string;
}

export interface JsonWebTokenSecrets {
	JWT_ACCESS_SECRET_KEY: string;
	JWT_ACCESS_EXPIRED_TIME: number;
	JWT_REFRESH_SECRET_KEY: string;
	JWT_REFRESH_EXPIRED_TIME: number;
	JWT_AA_SECRET_KEY: string;
	JWT_AA_EXPIRED_TIME: number;
}

export interface PostgreSQLSecrets {
	PG_HOST: string;
	PG_PORT: number;
	PG_USERNAME: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	PG_RETRY_TIME: number;
}

export type Environment = "development" | "production" | "testing";
export type HttpService = "express" | "fastify";
export type LoggerService = "console" | "winston";
export type SecretsParser = (o: object) => Readonly<Secrets>;
export interface Secrets extends JsonWebTokenSecrets, PostgreSQLSecrets, RabbitMQSecrets {
	SERVICE_NAME: string;
	THIS_URL: string;
	PORT: number;
	LOGGER_SERVICE: LoggerService;
	HTTP_SERVICE: HttpService;
}

/** Private */ class _Config {
	static #instance?: _Config; // crazy singleton 🤡

	readonly #NODE_ENV: Environment;
	readonly #secrets: Secrets;
	constructor(secretsParser: SecretsParser) {
		if (_Config.#instance !== undefined) return _Config.#instance;
		else _Config.#instance = this;

		try {
			this.#NODE_ENV = this.#getEnvironment(env.NODE_ENV);
			this.#secrets = secretsParser(env);
		} catch (error) {
			const output = (msg: string): void => console.log("\n", styleText(["red", "bold", "bgBlack"], msg), "\n");
			output("██████ FATAL ERROR ██████");
			output("The application cannot start due to a critical configuration error, please fix it and try again.");
			console.error(error instanceof Error ? error : new Error(String(error)));
			output("██████ SHUTING DOWN ██████");
			process.exit(1);
		}
	}

	readonly #getEnvironment = (NODE_ENV?: string): Environment => {
		if (NODE_ENV === undefined) throw this.#envError("is not defined");
		const environments: Environment[] = ["production", "testing", "development"];
		if (!environments.includes(NODE_ENV as Environment)) throw this.#envError(`= '${NODE_ENV}' is incompatible`, environments);
		if (NODE_ENV === "development") loadEnvFile(".env.dev");
		if (NODE_ENV === "testing") loadEnvFile(".env.test");
		if (NODE_ENV === "production") loadEnvFile(".env");
		return NODE_ENV as Environment;
	};

	readonly #envError = (msg: string, cause?: unknown): Error => new this.#Error(`Variable 'NODE_ENV' ${msg} 💩`, cause);
	readonly #Error = class EnvironmentError extends Error {
		constructor(message: string, cause: unknown) {
			super(message, { cause });
		}
	};

	public get secrets(): Readonly<Secrets> {
		return this.#secrets;
	}

	public get NODE_ENV(): Readonly<Environment> {
		return this.#NODE_ENV;
	}

	public get DEBUG(): boolean {
		return this.#NODE_ENV !== "production";
	}
}

export const { NODE_ENV, secrets, DEBUG } = new _Config(secretsParser);
