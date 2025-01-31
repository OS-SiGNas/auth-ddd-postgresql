import "reflect-metadata";

import { secrets, DEBUG_MODE, NODE_ENV } from "#Config";
import { Actions } from "#Domain/business/events/actions.enum.js";
import { systemDemons } from "#Infrastructure/system-demons/make.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#shared/logger-handler/make.js";
import type { Environment } from "#Config";
import type { SystemDemon } from "#Domain/SystemDemon";

void new (class {
	#hasError: boolean = false;
	readonly #demons: SystemDemon[] = systemDemons;
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
		void this.#boot();
	}

	readonly #boot = async (): Promise<void> => {
		try {
			for (const { start } of this.#demons) await start();
			void process.on("SIGINT", this.#shutdown);
			void process.on("SIGTERM", this.#shutdown);
			void eventBus.on(Actions.REBOOT, async (event) => {
				this.#logger.info(`ACTION: ${event.action} - ID: ${event.id}`);
				return await Promise.resolve(this.#reboot());
			});

			this.#logger.info(this.#demons.length + ` Servers started successfully`);
		} catch (error) {
			this.#logger.error("Application crashed");
			this.#hasError = true;
			if (DEBUG_MODE) console.trace("\n", error);
			await this.#shutdown();
		}
	};

	readonly #shutdown = async (): Promise<void> => {
		for (const { stop } of this.#demons) await stop();
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting");
		for (const { restart } of this.#demons) await restart();
	};
})();
