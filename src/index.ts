import "reflect-metadata";

import { secrets, DEBUG_MODE, NODE_ENV } from "#Config";
import { Actions } from "#Domain/events/actions.enum.js";
import { systemDemons } from "#Infrastructure/system-demons/make.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#common/logger-handler/make.js";

import type { Environment } from "#Config";
import type { SystemDemon } from "#Domain/SystemDemon";

void new (class {
	#hasError: boolean = false;
	readonly #demons: SystemDemon[] = systemDemons;
	readonly #environment: Environment = NODE_ENV;
	readonly #logger = new Logger(secrets.SERVICE_NAME);

	/** asynn */ constructor() {
		this.#logger.info("Starting Application");
		const messages: Record<Environment, string> = {
			development: "👽 DEV MODE 👽",
			testing: "🪲 TEST MODE 🪲",
			production: "🔥 ON 🔥",
		};

		this.#logger.info(messages[this.#environment]);
		void this.#boot();
	}

	readonly #boot = async (): Promise<void> => {
		try {
			await Promise.all(this.#demons.map(({ start }) => start()));
			void this.#subscribers();
			this.#logger.info(this.#demons.length + ` Servers started successfully`);
		} catch (error) {
			this.#hasError = true;
			this.#logger.error("Application crashed");
			if (DEBUG_MODE) this.#logger.error("trace: \n", error);
			await this.#shutdown();
		}
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

	readonly #subscribers = (): void => {
		void process.on("SIGINT", this.#shutdown);
		void process.on("SIGTERM", this.#shutdown);
		void eventBus.on(Actions.REBOOT, async (event) => {
			this.#logger.warn(`ACTION: ${event.action} - ID: ${event.id}`);
			return await Promise.resolve(this.#reboot());
		});
	};
})();
