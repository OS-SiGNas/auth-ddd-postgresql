import "reflect-metadata";
import { servers } from "./Infrastructure/make.js";

import type { IServer } from "./Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
	try {
		for (const server of servers) await server.start();
	} catch (error) {
		console.trace(error);
		for (const server of servers) server.stop();
		Promise.reject(process.exit(0));
	}
})(servers);
