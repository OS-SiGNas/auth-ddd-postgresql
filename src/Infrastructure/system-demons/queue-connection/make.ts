import { connect } from "amqplib";
import { secrets } from "#Config";
import { eventBus } from "#Infrastructure/event-bus.js";
import { errorHandler } from "#common/error-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";
import { RabbitMQConnection } from "./rabbitmq.connection.js";

export const rabbitmq = new RabbitMQConnection({
	connect,
	eventBus,
	errorHandler,
	queue: secrets.RABBIT_QUEUE,
	logger: new Logger("RabbitMQ"),
	options: {
		protocol: secrets.RABBIT_PROTOCOL,
		hostname: secrets.RABBIT_HOSTNAME,
		port: secrets.RABBIT_PORT,
		username: secrets.RABBIT_USERNAME,
		password: secrets.RABBIT_PASSWORD,
		vhost: secrets.RABBIT_VHOST,
	},
});
