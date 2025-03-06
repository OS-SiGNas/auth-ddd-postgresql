import { DataSource } from "typeorm";

import { secrets as s } from "#Config";
import { _PostgreServer } from "./postgresql.connection.js";
import { Logger } from "#shared/logger-handler/make.js";

// Entities
import { User } from "#users/v1/domain/entities/users.entity.js";
import { Role } from "#users/v1/domain/entities/roles.entity.js";

const entities = [User, Role];

export const postgresConnection = _PostgreServer.getInstance({
	logger: new Logger("PostgreServer"),
	retryTime: s.PG_RETRY_TIME,

	dataSource: new DataSource({
		type: "postgres",
		host: s.PG_HOST,
		port: s.PG_PORT,
		username: s.PG_USERNAME,
		password: s.PG_PASSWORD,
		database: s.PG_DATABASE,
		synchronize: true,
		logging: false,
		entities,
		subscribers: [],
		migrations: [],
	}),
});
