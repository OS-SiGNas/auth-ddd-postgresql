import "reflect-metadata";
import { servers } from "./Infrastructure/make.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { IServer } from "#Domain/IServer";

void (async (servers: IServer[]): Promise<void> => {
	const _logger = new Logger("Main");
	_logger.info(`Application init`);

	const _shutdownGracefully = (): void => {
		for (const { stop } of servers) stop();
		_logger.info("Exiting");
		process.exit(1);
	};

	try {
		for (const { start } of servers) await start();
		_logger.info("All servers started");
	} catch (error) {
		_logger.error("Application crashed");
		console.trace("\n", error);
		_shutdownGracefully();
	}

	process.on("SIGINT", _shutdownGracefully);
	process.on("SIGTERM", _shutdownGracefully);
})(servers);
