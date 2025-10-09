export type Environment = "development" | "production" | "testing";

export interface LoggerSecrets {
	LOGGER_SERVICE: "console" | "winston" | "logan";
	LOGGER_INTERVAL: number;
	LOGGER_WORKER_FILE: string;
}
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

export interface Secrets extends LoggerSecrets, JsonWebTokenSecrets, PostgreSQLSecrets, RabbitMQSecrets {
	SERVICE_NAME: string;
	THIS_URL: string;
	PORT: number;
	HTTP_SERVICE: "express" | "fastify";
}

export type SecretsParser = (o: object) => Readonly<Secrets>;
