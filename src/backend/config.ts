import { secretsParser } from "./Application/config/secrets.parser.js";
import { bgRed, white, cyan } from "#common/logger-handler/colors.utils.js";

import type { Secrets, Environment, SecretsParser } from "#Domain";

/** Private */ class _Config {
	static #instance?: _Config; // crazy singleton 🤡

	readonly #NODE_ENV: Environment;
	readonly #secrets: Secrets;
	readonly #Error = class EnvironmentError extends Error {
		constructor(message: string, cause: unknown) {
			super(message, { cause });
		}
	};

	constructor(secretsParser: SecretsParser) {
		if (_Config.#instance !== undefined) return _Config.#instance;
		else _Config.#instance = this;

		try {
			this.#NODE_ENV = this.#getEnvironment(process.env.NODE_ENV);
			this.#secrets = secretsParser(process.env);
			console.info(`${white("**")}${cyan(" CONFIG SUCCESS ")}${white("**")}`);
		} catch (error) {
			const fatal = (msg: string): void => console.log("\n", "██████", bgRed(msg), "██████", "\n");
			fatal("FATAL ERROR");
			fatal("The application cannot start due to a critical configuration error, please fix it and try again.");
			console.error(error instanceof Error ? error : new Error(String(error)));
			fatal(" SHUTING DOWN");
			process.exit(1);
		}
	}

	readonly #envError = (msg: string, cause?: unknown): Error => new this.#Error(`Variable 'NODE_ENV' ${msg} 💩`, cause);
	readonly #getEnvironment = (NODE_ENV?: string): Environment => {
		if (NODE_ENV === undefined) throw this.#envError("is not defined");
		const environments: Environment[] = ["production", "testing", "development"];
		if (!environments.includes(NODE_ENV as Environment)) throw this.#envError(`= '${NODE_ENV}' is incompatible`, environments);
		if (NODE_ENV === "development") process.loadEnvFile(".env.dev");
		if (NODE_ENV === "testing") process.loadEnvFile(".env.test");
		if (NODE_ENV === "production") process.loadEnvFile(".env");
		return NODE_ENV as Environment;
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
