import { env, loadEnvFile } from "node:process";
import { z, ZodError } from "zod";
import { UnprocessableException422 } from "#Domain/errors/error.factory.js";

export type Environment = "development" | "production" | "testing";
type HttpService = "express" | "fastify";
type LoggerService = "console" | "winston";

interface RabbitMQSecrets {
	RABBIT_QUEUE: string;
	RABBIT_PORT: number;
	RABBIT_HOSTNAME: string;
	RABBIT_PROTOCOL: string;
	RABBIT_USERNAME: string;
	RABBIT_PASSWORD: string;
	RABBIT_VHOST: string;
}

interface JsonWebTokenSecrets {
	JWT_ACCESS_SECRET_KEY: string;
	JWT_ACCESS_EXPIRED_TIME: number;
	JWT_REFRESH_SECRET_KEY: string;
	JWT_REFRESH_EXPIRED_TIME: number;
	JWT_AA_SECRET_KEY: string;
	JWT_AA_EXPIRED_TIME: number;
}

interface PostgreSQLSecrets {
	PG_HOST: string;
	PG_PORT: number;
	PG_USERNAME: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	PG_RETRY_TIME: number;
}

interface Secrets extends JsonWebTokenSecrets, PostgreSQLSecrets, RabbitMQSecrets {
	SERVICE_NAME: string;
	THIS_URL: string;
	PORT: number;
	LOGGER_SERVICE: LoggerService;
	HTTP_SERVICE: HttpService;
}

class Config {
	static #instance?: Config; // crazy singleton 🤡
	static get instance(): Readonly<Config> {
		return (this.#instance ??= new Config());
	}

	readonly #env: NodeJS.ProcessEnv;
	readonly #NODE_ENV: Environment;
	readonly #secrets: Secrets;

	private constructor() {
		try {
			this.#env = env;
			this.#NODE_ENV = this.#getEnvironment();
			this.#secrets = this.#getSecrets();
		} catch (error) {
			if (!(error instanceof ZodError)) throw error;
			const cause: string[] = error.issues.map(({ path, message }) => `${path}: ${message}`);
			throw new UnprocessableException422("( Config ) Dotenv file incompatible 💩", { cause });
		}
	}

	readonly #getEnvironment = (): Environment => {
		const NODE_ENV: Environment = z.enum(["production", "testing", "development"]).parse(this.#env.NODE_ENV);
		if (NODE_ENV === "production") loadEnvFile(".env");
		if (NODE_ENV === "development") loadEnvFile(".env.dev");
		if (NODE_ENV === "testing") loadEnvFile(".env.test");
		return NODE_ENV;
	};

	readonly #getSecrets = (): Secrets => {
		const zString = z.string().nonempty();
		const zPort = z.string().transform(Number).pipe(z.number().positive().min(80).max(65535));
		const zNumber = z.string().transform(Number).pipe(z.number().positive());
		const zPassword = z.string().min(8).max(64);
		const schema = {
			SERVICE_NAME: zString,
			LOGGER_SERVICE: z.enum(["winston", "console"]),
			HTTP_SERVICE: z.enum(["express", "fastify"]),
			THIS_URL: zString,
			PORT: zPort,
			PG_HOST: zString,
			PG_PORT: zPort,
			PG_USERNAME: zString,
			PG_PASSWORD: zPassword,
			PG_DATABASE: zString,
			PG_RETRY_TIME: zNumber,
			JWT_ACCESS_SECRET_KEY: zString,
			JWT_ACCESS_EXPIRED_TIME: zNumber,
			JWT_REFRESH_SECRET_KEY: zString,
			JWT_REFRESH_EXPIRED_TIME: zNumber,
			JWT_AA_SECRET_KEY: zString,
			JWT_AA_EXPIRED_TIME: zNumber,
			RABBIT_QUEUE: zString,
			RABBIT_PORT: zPort,
			RABBIT_HOSTNAME: zString,
			RABBIT_PROTOCOL: zString,
			RABBIT_USERNAME: zString,
			RABBIT_PASSWORD: zPassword,
			RABBIT_VHOST: zString,
		};

		return z.object(schema).parse(this.#env);
	};

	public get secrets(): Readonly<Secrets> {
		return this.#secrets;
	}

	public get NODE_ENV(): Readonly<Environment> {
		return this.#NODE_ENV;
	}

	public get DEBUG_MODE(): boolean {
		return this.#NODE_ENV !== "production";
	}
}

export const { secrets, NODE_ENV, DEBUG_MODE } = Config.instance;
