import { httpServer } from "./http-server/make.js";
import { postgresConnection } from "./database-connection/make.js";
import { rabbitmqConnection } from "./queue-connection/make.js";

import type { SystemDaemon } from "#Domain";
export const systemDaemons: SystemDaemon[] = [httpServer, postgresConnection, rabbitmqConnection] as const;
