import { DataSource } from "typeorm";

import { DEBUG_MODE, secrets } from "#Config";
import { _PostgreServer } from "./postgresql.connection.js";
import { Logger } from "#shared/logger-handler/make.js";

// Entities
import { User } from "#users/v1/domain/entities/users.entity.js";
import { Role } from "#users/v1/domain/entities/roles.entity.js";

const entities = [User, Role];

export const postgresConnection = _PostgreServer.getInstance({
	logger: new Logger("PostgreServer"),
	retryTime: secrets.PG_RETRY_TIME,

	dataSource: new DataSource({
		type: "postgres",
		host: secrets.PG_HOST,
		port: secrets.PG_PORT,
		username: secrets.PG_USERNAME,
		password: secrets.PG_PASSWORD,
		database: secrets.PG_DATABASE,
		synchronize: true,
		logging: DEBUG_MODE,
		entities,
		subscribers: [],
		migrations: [],
	}),
});
