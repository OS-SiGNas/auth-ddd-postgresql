import "reflect-metadata";
import { exit } from "node:process";
import { servers } from "./Infrastructure/make.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { IServer } from "#Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
	const logger = new Logger("Main");
	logger.info(`Application init`);

	try {
		for (const server of servers) await server.start();
		logger.info("All servers started");
	} catch (error) {
		logger.error("Application crashed");
		console.trace(error);
		for (const server of servers) server.stop();
		void exit(1);
	}
})(servers);
