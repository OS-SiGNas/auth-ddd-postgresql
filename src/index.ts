import "reflect-metadata";

import { secrets, DEBUG_MODE, NODE_ENV } from "#Config";
import { Actions } from "#Domain/events/actions.enum.js";
import { systemDemons } from "#Infrastructure/system-demons/make.js";
import { eventBus } from "#Infrastructure/event-bus.js";
import { Logger } from "#common/logger-handler/make.js";

import type { Environment } from "#Config";
import type { SystemDemon } from "#Domain/SystemDemon";

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

		(async (): Promise<void> => {
			try {
				await this.#boot();
			} catch (error) {
				this.#hasError = true;
				this.#logger.error("Application crashed");
				if (DEBUG_MODE) this.#logger.error("trace: \n", error);
				await this.#shutdown();
			}
		})();
	}

	readonly #boot = async (): Promise<void> => {
		await Promise.all(this.#demons.map(({ start }) => start()));
		this.#subscribers();
		this.#logger.info(this.#demons.length + ` System demons started successfully`);
	};

	readonly #shutdown = async (): Promise<void> => {
		await Promise.all(this.#demons.map(({ stop }) => stop()));
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting demons");
		await Promise.all(this.#demons.map(({ restart }) => restart()));
		for (const { restart } of this.#demons) await restart();
	};

	readonly #subscribers = (): void => {
		process.on("SIGINT", this.#shutdown);
		process.on("SIGTERM", this.#shutdown);
		eventBus.on(Actions.REBOOT, async (event) => {
			this.#logger.warn(`ACTION: ${event.action} - ID: ${event.id}`);
			return await Promise.resolve(this.#reboot());
		});
	};
})();
