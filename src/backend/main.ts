import type { SystemDaemon } from "#Domain";

import "reflect-metadata";
import { secrets, DEBUG, NODE_ENV } from "#Config";
import { ACTIONS } from "#Domain";
import { bus } from "#Infrastructure/event-bus.js";
import { postgresConnection } from "#Infrastructure/system-daemons/database-connection/make.js";
import { rabbitmqConnection } from "#Infrastructure/system-daemons/queue-connection/make.js";
import { httpServer } from "#Infrastructure/system-daemons/http-server/make.js";
import { Logger } from "#common/logger-handler/make.js";

new (class {
	readonly #daemons: SystemDaemon[] = [httpServer, rabbitmqConnection, postgresConnection];
	readonly #logger = new Logger(secrets.SERVICE_NAME);
	#hasError: boolean = false;

	constructor() {
		const { info } = this.#logger;
		info("Starting application");
		if (NODE_ENV === "development") info("👽 DEV MODE 👽");
		if (NODE_ENV === "testing") info("🪲 TEST MODE 🪲");
		if (NODE_ENV === "production") info("🔥 ON 🔥");

		void this.#boot().then(this.#subscribers).catch(this.#error);
	}

	readonly #boot = async (): Promise<void> => {
		await Promise.all(this.#daemons.map(({ start }) => start()));
		this.#logger.info(this.#daemons.length + ` system daemons started successfully`);
		return await Promise.resolve();
	};

	readonly #shutdown = async (): Promise<void> => {
		await Promise.all(this.#daemons.map(({ stop }) => stop()));
		this.#logger.info("Shudown protocol successfully");
		process.exit(this.#hasError ? 1 : 0);
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting daemons");
		await Promise.all(this.#daemons.map(({ restart }) => restart()));
		return await Promise.resolve();
	};

	readonly #subscribers = (): void => {
		process.on("SIGINT", this.#shutdown);
		process.on("SIGTERM", this.#shutdown);
		bus.on(ACTIONS.SYSTEM_SHUTDOWN, this.#shutdown);
		bus.on(ACTIONS.SYSTEM_REBOOT, async ({ metadata: { id, action, emitter }, message, context }) => {
			this.#logger.warn(`Metadata: action: ${action} - id: ${id} - emitter: ${emitter}`);
			if (context !== null) this.#logger.warn("CONTEXT: ", context);
			this.#logger.warn(message);
			return await this.#reboot();
		});
	};

	readonly #error = async (e: unknown): Promise<void> => {
		this.#logger.error("██████ Error starting daemons ██████\n");
		this.#hasError = true;
		const error = e instanceof Error ? e : new Error(String(e));
		if (DEBUG) this.#logger.error("DEBUG TRACE:\n", error);
		else this.#logger.error(`${error.name}: ${error.message}`);

		return await this.#shutdown();
	};
})();
