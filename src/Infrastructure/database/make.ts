import { DataSource } from "typeorm";

import _PostgreDBServer from "./PostgreDBServer.js";

import { ENVIRONMENT, secrets } from "../../Domain/System.js";
import { User } from "../../Applications/users/domain/entities/users.entity.js";
import { Role } from "../../Applications/users/domain/entities/roles.entity.js";

const dataSource = new DataSource({
  type: "postgres",
  host: secrets.PG_HOST,
  port: +secrets.PG_PORT,
  username: secrets.PG_USERNAME,
  password: secrets.PG_PASSWORD,
  database: secrets.PG_DATABASE,
  synchronize: true,
  logging: ENVIRONMENT !== "production",
  entities: [User, Role],
  subscribers: [],
  migrations: [],
});

export const postgresServer = new _PostgreDBServer({ db: dataSource });
