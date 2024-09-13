import "reflect-metadata";
import { servers } from "./Infrastructure/make.js";
import { _LoggerConsole } from "./Applications/shared/logger-handler/_logger-console.js";

import type { IServer } from "./Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
	const logger = _LoggerConsole.getInstance();
	try {
		for (const server of servers) await server.start();
	} catch (error) {
		logger.error(error);
		for (const server of servers) server.stop();
		Promise.reject(process.exit(0));
	}
})(servers);
