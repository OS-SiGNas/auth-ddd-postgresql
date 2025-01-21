import "reflect-metadata";
import { DEBUG_MODE } from "#config";
import { Logger } from "#shared/logger-handler/make.js";
import { servers } from "./Infrastructure/make.js";

void class {
	static readonly #logger = new Logger("Main");

	public static readonly init = async (): Promise<void> => {
		this.#logger.info("Starting Application");
		try {
			await this.#boot();
			process.on("SIGINT", this.#shutdownGracefully);
			process.on("SIGTERM", this.#shutdownGracefully);
		} catch (error) {
			this.#logger.error("Application crashed");
			if (DEBUG_MODE) console.trace("\n", error);
			await this.#shutdownGracefully();
		}
	};

	static readonly #boot = async (): Promise<void> => {
		for (const { start } of servers) await start();
		this.#logger.info(servers.length + " Servers started");
	};

	static readonly #shutdownGracefully = async (): Promise<void> => {
		for (const { stop } of servers) await stop();
		this.#logger.info("Shudown Gracefully");
		process.exit(1);
	};
}.init();
