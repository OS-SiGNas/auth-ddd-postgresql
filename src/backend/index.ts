import "reflect-metadata";
import "#Config";
import { Actions, bus } from "#Domain";
import { httpServer } from "#Infrastructure/system-daemons/http-server/make.js";
import { rabbitmqConnection } from "#Infrastructure/system-daemons/queue-connection/make.js";
import { postgresConnection } from "#Infrastructure/system-daemons/database-connection/make.js";
import Main from "./main.js";

bus.emit(Actions.SYSTEM_BOOT, new Main(bus, [httpServer, rabbitmqConnection, postgresConnection]));
