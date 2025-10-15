import { DataSource } from "typeorm";

import { secrets as s } from "#Config";
import { Logger } from "#common/logger-handler/make.js";
import { _PostgreConnection } from "./postgresql.connection.js";

// Entities
import { User } from "#users/v1/domain/entities/users.entity.js";
import { Role } from "#users/v1/domain/entities/roles.entity.js";

import type { SystemDaemon } from "#Domain";

const entities = [User, Role];

export const postgresConnection: SystemDaemon = _PostgreConnection.getInstance({
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
