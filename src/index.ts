import "reflect-metadata";
import { logger } from "./Applications/shared/logger-handler/make.js";
import { servers } from "./Infrastructure/make.js";

import type { IServer } from "./Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
  try {
    for (const server of servers) await server.start();
  } catch (error) {
    logger.error(error);
    for (const server of servers) await server.stop();
  }
})(servers);
