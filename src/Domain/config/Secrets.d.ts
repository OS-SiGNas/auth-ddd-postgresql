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

type HttpService = "express" | "fastify";
type LoggerService = "console" | "winston";

export interface Secrets extends JsonWebTokenSecrets, PostgreSQLSecrets, RabbitMQSecrets {
	SERVICE_NAME: string;
	THIS_URL: string;
	PORT: number;
	LOGGER_SERVICE: LoggerService;
	HTTP_SERVICE: HttpService;
}
