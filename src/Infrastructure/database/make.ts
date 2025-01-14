import { DataSource } from "typeorm";

import { secrets } from "#config";
import { _PostgreServer } from "./postgresql.server.js";
import { Logger } from "../../Applications/shared/logger-handler/make.js";
// Entities
import { User } from "#users/v1/domain/entities/users.entity.js";
import { Role } from "#users/v1/domain/entities/roles.entity.js";

export const postgresServer = _PostgreServer.getInstance({
	logger: new Logger("PostgreServer"),
	retryTime: secrets.PG_RETRY_TIME,
	dataSource: new DataSource({
		type: "postgres",
		host: secrets.PG_HOST,
		port: +secrets.PG_PORT,
		username: secrets.PG_USERNAME,
		password: secrets.PG_PASSWORD,
		database: secrets.PG_DATABASE,
		synchronize: true,
		logging: true,
		entities: [User, Role],
		subscribers: [],
		migrations: [],
	}),
});
