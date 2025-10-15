import { connect } from "amqplib";

import { secrets } from "#Config";
import { bus, type SystemDaemon } from "#Domain";
import { errorHandler } from "#common/error-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";
import { RabbitMQConnection } from "./rabbitmq.connection.js";

export const rabbitmqConnection: SystemDaemon = new RabbitMQConnection({
	logger: new Logger("RabbitMQ"),
	queue: secrets.RABBIT_QUEUE,
	errorHandler,
	connect,
	bus,
	options: {
		protocol: secrets.RABBIT_PROTOCOL,
		hostname: secrets.RABBIT_HOSTNAME,
		port: secrets.RABBIT_PORT,
		username: secrets.RABBIT_USERNAME,
		password: secrets.RABBIT_PASSWORD,
		vhost: secrets.RABBIT_VHOST,
	},
});
