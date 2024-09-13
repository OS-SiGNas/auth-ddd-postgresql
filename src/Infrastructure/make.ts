import { postgresServer } from "./database/make.js";
import { httpServer } from "./http/make.js";

import type { IServer } from "../Domain/IServer";

export const servers: IServer[] = [postgresServer, httpServer];
