import "reflect-metadata";
import { DEBUG_MODE, NODE_ENV, secrets } from "#config";
import { Logger } from "#shared/logger-handler/make.js";
import { systemDemons } from "#Infrastructure/system-demons/make.js";

import type { Environment } from "#config";
import type { SystemDemon } from "#Domain/SystemDemon";

/**
export const index = new (class {
export default new (class { */
void new (class {
	#hasError: boolean = false;
	readonly #daemons: SystemDemon[] = systemDemons;
	readonly #logger = new Logger(secrets.APP_NAME);
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
			} catch (error) {
				this.#logger.error("Application crashed");
				this.#hasError = true;
				if (DEBUG_MODE) console.trace("\n", error);
				await this.#shutdown();
			}
		})();
	}

	readonly #boot = async (): Promise<void> => {
		for (const { start } of this.#daemons) await start();
		process.on("SIGTERM", this.#shutdown);
		process.on("SIGINT", this.#shutdown);
		this.#logger.info(this.#daemons.length + ` Servers started successfully`);
	};

	readonly #shutdown = async (): Promise<void> => {
		for (const { stop } of this.#daemons) await stop();
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};
})();
