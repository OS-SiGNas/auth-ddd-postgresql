import { secrets, DEBUG, NODE_ENV } from "#Config";
import { ACTIONS } from "#Domain";
import { systemDemons } from "#Infrastructure/system-demons/make.js";
import { bus } from "#Infrastructure/event-bus.js";
import { Logger } from "#common/logger-handler/make.js";

import type { SystemDemon, Environment } from "#Domain";

new (class {
	readonly #demons: SystemDemon[] = systemDemons;
	readonly #environment: Environment = NODE_ENV;
	readonly #logger = new Logger(secrets.SERVICE_NAME);
	#hasError: boolean = false;

	/** asynn */ constructor() {
		const messages: Record<Environment, string> = {
			development: "👽 DEV MODE 👽",
			testing: "🪲 TEST MODE 🪲",
			production: "🔥 ON 🔥",
		};

		this.#logger.info("Starting Application");
		this.#logger.info(messages[this.#environment]);

		void (async (): Promise<void> => {
			try {
				await this.#boot();
			} catch (error) {
				this.#hasError = true;
				this.#logger.error("Application crashed");
				if (DEBUG) this.#logger.error("trace: \n", error);
				await this.#shutdown();
			}
		})();
	}

	readonly #boot = async (): Promise<void> => {
		await Promise.all(this.#demons.map(({ start }) => start()));
		this.#logger.info(this.#demons.length + ` System demons started successfully`);

		process.on("SIGINT", this.#shutdown);
		process.on("SIGTERM", this.#shutdown);
		bus.on(ACTIONS.SYSTEM_REBOOT, async (event) => {
			this.#logger.warn(`ACTION: ${event.action} - ID: ${event.id}`);
			return await Promise.resolve(this.#reboot());
		});
	};

	readonly #shutdown = async (): Promise<void> => {
		await Promise.all(this.#demons.map(({ stop }) => stop()));
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting demons");
		await Promise.all(this.#demons.map(({ restart }) => restart()));
	};
})();
