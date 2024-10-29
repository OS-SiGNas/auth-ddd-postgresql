import { DataSource } from "typeorm";

import { SECRETS } from "../../Domain/System.js";
import { _PostgreServer } from "./postgre.server.js";
import { Logger } from "../../Applications/shared/logger-handler/make.js";
// Entities
import { User } from "../../Applications/users/domain/entities/users.entity.js";
import { Role } from "../../Applications/users/domain/entities/roles.entity.js";

export const postgresServer = _PostgreServer.getInstance({
	logger: new Logger("PostgreServer"),
	dataSource: new DataSource({
		type: "postgres",
		host: SECRETS.PG_HOST,
		port: +SECRETS.PG_PORT,
		username: SECRETS.PG_USERNAME,
		password: SECRETS.PG_PASSWORD,
		database: SECRETS.PG_DATABASE,
		synchronize: true,
		logging: true,
		entities: [User, Role],
		subscribers: [],
		migrations: [],
	}),
});
