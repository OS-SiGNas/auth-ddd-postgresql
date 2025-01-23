import "reflect-metadata";

import { DEBUG_MODE, NODE_ENV } from "#config";

//  TODO: import { eventBus } from "#shared/event-handler/make.js"
import { Logger } from "#shared/logger-handler/make.js";
import { servers } from "./Infrastructure/make.js";

import type { Environment } from "#config";

/**
export const index = new (class {
export default new (class { */
void new (class {
	readonly #logger = new Logger("API-GATEWAY");
	readonly #environment: Environment;
	readonly #envMessage: Record<Environment, string>;
	#hasError: boolean;

	/** asynn */ constructor() {
		this.#logger.info("Starting Application");

		this.#hasError = false;
		this.#environment = NODE_ENV;
		this.#envMessage = {
			development: "👽 DEV MODE 👽",
			testing: "🪲 TEST MODE 🪲",
			production: "🔥 ON 🔥",
		};

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
		this.#logger.info(this.#envMessage[this.#environment]);
		for (const { start } of servers) await start();
		this.#logger.info(servers.length + ` Servers started successfully`);
	};

	readonly #shutdown = async (): Promise<void> => {
		for (const { stop } of servers) await stop();
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};
})();
