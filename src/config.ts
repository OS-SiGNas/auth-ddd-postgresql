import { env, loadEnvFile } from "node:process";
import { z, ZodError } from "zod";

interface JsonWebTokenSecrets {
	JWT_ACCESS_SECRET_KEY: string;
	JWT_ACCESS_EXPIRED_TIME: string;
	JWT_REFRESH_SECRET_KEY: string;
	JWT_REFRESH_EXPIRED_TIME: string;
	JWT_AA_SECRET_KEY: string;
	JWT_AA_EXPIRED_TIME: string;
}

interface PostgreSQLSecrets {
	PG_HOST: string;
	PG_PORT: number;
	PG_USERNAME: string;
	PG_PASSWORD: string;
	PG_DATABASE: string;
	PG_RETRY_TIME: number;
}

type Environment = "development" | "production" | "testing";
type HttpService = "express" | "fastify";
type LoggerService = "console" | "winston";

interface Secrets extends JsonWebTokenSecrets, PostgreSQLSecrets {
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
			let cause: string[] | undefined;
			if (error instanceof ZodError) cause = error.issues.map(({ path, message }) => `${path}: ${message}`);
			throw new Error("Dotenv file incompatible", Array.isArray(cause) ? { cause } : undefined);
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
		const zString = z.string().min(1);
		const zPort = z.string().transform(Number).pipe(z.number().positive().min(3000).max(35536));
		const zNumber = z.string().transform(Number).pipe(z.number().positive());
		const zPassword = z.string().min(8).max(64);
		const schema = {
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
			JWT_ACCESS_EXPIRED_TIME: zString,
			JWT_REFRESH_SECRET_KEY: zString,
			JWT_REFRESH_EXPIRED_TIME: zString,
			JWT_AA_SECRET_KEY: zString,
			JWT_AA_EXPIRED_TIME: zString,
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
