import "reflect-metadata";

import { secrets, DEBUG, NODE_ENV } from "#Config";
import { ACTIONS, bus } from "#Domain";
import { Logger } from "#common/logger-handler/make.js";

import type { Subscribers, SystemDaemon } from "#Domain";

/**
 * @description
 * @description Main class */
export default class {
	#hasError: boolean = false;
	readonly #logger = new Logger(secrets.SERVICE_NAME);
	readonly #daemons: SystemDaemon[];

	constructor(subscribers: Subscribers, daemons: SystemDaemon[]) {
		this.#logger.info("██████ STARTING APPLICATION ██████");
		if (NODE_ENV === "development") this.#logger.info("👽 DEV MODE 👽");
		if (NODE_ENV === "testing") this.#logger.info("🪲 TEST MODE 🪲");
		if (NODE_ENV === "production") this.#logger.info("🔥 ON 🔥");
		this.#daemons = daemons;
		process.on("SIGINT", this.#shutdown);
		process.on("SIGTERM", this.#shutdown);
		bus.on(ACTIONS.SYSTEM_SHUTDOWN, this.#shutdown);
		bus.on(ACTIONS.SYSTEM_REBOOT, this.#reboot);

		void this.#boot(subscribers);
	}

	readonly #boot = async (subscribers: Subscribers): Promise<void> => {
		this.#logger.info(this.#daemons.length + ` system daemons started successfully`);
		try {
			await Promise.all(this.#daemons.map((d) => d.start()));
			await subscribers(bus);
		} catch (e) {
			this.#logger.error("██████ Error starting daemons ██████\n");
			this.#hasError = true;
			const error = e instanceof Error ? e : new Error(String(e));
			if (DEBUG) this.#logger.error("DEBUG TRACE:\n", error);
			else this.#logger.error(`${error.name}: ${error.message}`);
			return await Promise.reject(this.#shutdown());
		}
	};

	readonly #reboot = async (): Promise<void> => {
		this.#logger.warn("Rebooting daemons");
		await Promise.all(this.#daemons.map((d) => d.restart()));
		return await Promise.resolve();
	};

	readonly #shutdown = async (): Promise<never> => {
		this.#logger.info("██████ SHUTING DOWN ██████");
		await Promise.all(this.#daemons.map((d) => d.stop()));
		this.#logger.info("Shudown protocol successfully");
		bus.removeAllListeners();
		process.removeAllListeners();
		return process.exit(this.#hasError ? 1 : 0);
	};
}
