import type { SystemDemon } from "#Domain";

import "reflect-metadata";
import { secrets, DEBUG, NODE_ENV } from "#Config";
import { ACTIONS } from "#Domain";
import { bus } from "#Infrastructure/event-bus.js";
import { postgresConnection } from "#Infrastructure/system-demons/database-connection/make.js";
import { rabbitmqConnection } from "#Infrastructure/system-demons/queue-connection/make.js";
import { httpServer } from "#Infrastructure/system-demons/http-server/make.js";
import { Logger } from "#common/logger-handler/make.js";

new (class {
	readonly #demons: SystemDemon[] = [httpServer, rabbitmqConnection, postgresConnection];
	readonly #logger = new Logger(secrets.SERVICE_NAME);
	#hasError: boolean = false;
	/** asynn */ constructor() {
		this.#logger.info("Starting application");
		if (NODE_ENV === "development") this.#logger.info("👽 DEV MODE 👽");
		if (NODE_ENV === "testing") this.#logger.info("🪲 TEST MODE 🪲");
		if (NODE_ENV === "production") this.#logger.info("🔥 ON 🔥");
		void this.#boot().catch((error) => {
			this.#hasError = true;
			this.#logger.error("Application crashed\n");
			if (DEBUG) this.#logger.error("DEBUG TRACE:\n", error);
		});
	}

	readonly #boot = async (): Promise<void> => {
		// Start Demons
		await Promise.all(this.#demons.map(({ start }) => start()));
		this.#logger.info(this.#demons.length + ` system demons started successfully`);
		// Process SIGNALS Subscribers // Domain EventBus: System ACTIONS Subscribers
		process.on("SIGINT", this.#shutdown);
		process.on("SIGTERM", this.#shutdown);
		bus.on(ACTIONS.SYSTEM_SHUTDOWN, this.#shutdown);
		bus.on(ACTIONS.SYSTEM_REBOOT, async ({ metadata: { id, emitter, action }, message, context }) => {
			this.#logger.warn(`METADATA: action: ${action} - ID: ${id} - Emitter: ${emitter}`);
			if (context !== null) this.#logger.warn("CONTEXT: ", context);
			this.#logger.warn(message);
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
