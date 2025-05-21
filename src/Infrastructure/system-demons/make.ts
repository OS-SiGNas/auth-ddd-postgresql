import { postgresConnection } from "./database-connection/make.js";
import { httpServer } from "./http-server/make.js";
import { rabbitmq } from "./queue-connection/make.js";

import type { SystemDemon } from "#Domain";

export const systemDemons: SystemDemon[] = [
	// Order
	httpServer,
	rabbitmq.queueConnection,
	postgresConnection,
];
