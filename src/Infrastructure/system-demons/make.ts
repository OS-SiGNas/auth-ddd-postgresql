import { postgresConnection } from "./database-connection/make.js";
import { httpServer } from "./http-server/make.js";

import type { SystemDemon } from "#Domain/SystemDemon.js";

export const systemDemons: SystemDemon[] = [httpServer, postgresConnection];
