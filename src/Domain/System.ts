import { config as dotEnvConfig } from "dotenv";
import { logger } from "../Applications/shared/logger-handler/make.js";

export type Environment = "development" | "production" | "test";
type Variables = "HTTP_SERVICE" | "PORT" | "PG_HOST" | "PG_PORT" | "PG_USERNAME" | "PG_PASSWORD" | "PG_DATABASE" | "JWT_SECRET_KEY" | "JWT_EXPIRED_TIME";
type HttpService = "express" | "fastify";
type Secrets = Readonly<Record<Variables, string>>;

class System {
  readonly #environment: Environment;

  private constructor() {
    dotEnvConfig();
    this.#environment = process.env["ENVIRONMENT"] as Environment;
  }

  static #instance?: System; // crazy singleton 🤡
  static get instance(): Readonly<System> {
    if (this.#instance === undefined) this.#instance = new System();
    return this.#instance;
  }

  readonly #error = (variable: Variables): Error => new Error(`💩 Environment Variable: ${variable} is undefined`);
  readonly #getSecretFromDotEnv = (variable: Variables): Readonly<string> => {
    const target = process.env[variable];
    if (target === undefined) throw this.#error(variable);
    logger.debug(`[${System.name}] ✓ ${variable}`);
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
      JWT_SECRET_KEY: this.#getSecretFromDotEnv("JWT_SECRET_KEY"),
      JWT_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_EXPIRED_TIME"),
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
