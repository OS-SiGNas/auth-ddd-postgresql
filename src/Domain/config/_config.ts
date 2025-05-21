import { env, loadEnvFile } from "node:process";
import type { Environment } from "./Environment";
import type { Secrets } from "./Secrets";

type SecretsParser = (o: object) => Readonly<Secrets>;

export class _Config {
	static #instance?: _Config; // crazy singleton 🤡

	readonly #NODE_ENV: Environment;
	readonly #secrets: Secrets;
	constructor(secretsParser: SecretsParser) {
		if (_Config.#instance !== undefined) return _Config.#instance;
		else _Config.#instance = this;

		this.#NODE_ENV = this.#getEnvironment(env.NODE_ENV);
		this.#secrets = secretsParser(env);
	}

	readonly #envError = (msg: string, cause?: unknown): Error => new Error(`Environment variable 'NODE_ENV' ${msg}`, { cause });
	readonly #getEnvironment = (NODE_ENV?: string): Environment => {
		if (NODE_ENV === undefined) throw this.#envError("is undefined");
		const environments: Environment[] = ["production", "testing", "development"];
		if (!environments.includes(NODE_ENV as Environment)) throw this.#envError("is incompatible", environments);
		if (NODE_ENV === "development") loadEnvFile(".env.dev");
		if (NODE_ENV === "testing") loadEnvFile(".env.test");
		if (NODE_ENV === "production") loadEnvFile(".env");
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
