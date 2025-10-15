import "reflect-metadata";

import { secrets } from "#Config";
import { bus, Actions } from "#Domain";

import { postgresConnection } from "#Infrastructure/system-daemons/database-connection/make.js";
import { rabbitmqConnection } from "#Infrastructure/system-daemons/queue-connection/make.js";
import { httpServer } from "#Infrastructure/system-daemons/http-server/make.js";
import { Logger } from "#common/logger-handler/make.js";
import { _Main } from "./main.js";

bus.emit(
	Actions.SYSTEM_BOOT,
	new _Main({
		daemons: [postgresConnection, rabbitmqConnection, httpServer],
		logger: new Logger(secrets.APP_NAME),
		bus,
	})
);
