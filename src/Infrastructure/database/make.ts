import { DataSource } from "typeorm";

import { secrets } from "../../Domain/System.js";
import { _PostgreServer } from "./postgre.server.js";
import { Logger } from "../../Applications/shared/logger-handler/logger.js";
// Entities
import { User } from "../../Applications/users/domain/entities/users.entity.js";
import { Role } from "../../Applications/users/domain/entities/roles.entity.js";

export const postgresServer = _PostgreServer.getInstance({
	logger: new Logger("PostgreServer"),
	dataSource: new DataSource({
		type: "postgres",
		host: secrets.PG_HOST,
		port: +secrets.PG_PORT,
		username: secrets.PG_USERNAME,
		password: secrets.PG_PASSWORD,
		database: secrets.PG_DATABASE,
		synchronize: true,
		logging: secrets.NODE_ENV !== "production",
		entities: [User, Role],
		subscribers: [],
		migrations: [],
	}),
});
