import "reflect-metadata";
import { servers } from "./Infrastructure/make.js";
import { Logger } from "./Applications/shared/logger-handler/logger.js";

import type { IServer } from "./Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
	const logger = new Logger("Main");
	logger.info(`Application init`);

	try {
		for (const server of servers) await server.start();
	} catch (error) {
		logger.error(error);
		for (const server of servers) server.stop();
		Promise.reject(process.exit(0));
	}
})(servers);
