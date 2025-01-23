import "reflect-metadata";

import { DEBUG_MODE, NODE_ENV } from "#config";

import { Logger } from "#shared/logger-handler/make.js";
import { servers } from "./Infrastructure/make.js";

import type { Environment } from "#config";
import { IServer } from "#Domain/IServer.js";

/**
export const index = new (class {
export default new (class { */
void new (class {
	#hasError: boolean = false;
	readonly #servers: IServer[] = servers;
	readonly #logger = new Logger("API-GATEWAY");
	readonly #environment: Environment = NODE_ENV;
	readonly #environmentMessage: string = {
		development: "👽 DEV MODE 👽",
		testing: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	}[this.#environment];

	/** asynn */ constructor() {
		this.#logger.info("Starting Application");
		this.#logger.info(this.#environmentMessage);
		void (async (): Promise<void> => {
			try {
				await this.#boot();
				process.on("SIGINT", this.#shutdown);
				process.on("SIGTERM", this.#shutdown);
			} catch (error) {
				this.#logger.error("Application crashed");
				this.#hasError = true;
				if (DEBUG_MODE) console.trace("\n", error);
				await this.#shutdown();
			}
		})();
	}

	readonly #boot = async (): Promise<void> => {
		for (const { start } of this.#servers) await start();
		this.#logger.info(servers.length + ` Servers started successfully`);
	};

	readonly #shutdown = async (): Promise<void> => {
		for (const { stop } of this.#servers) await stop();
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};
})();
