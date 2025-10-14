import { secrets, DEBUG, NODE_ENV } from "#Config";
import { Actions } from "#Domain";
import { Logger } from "#common/logger-handler/make.js";

import type { DomainEventBus, SystemDaemon } from "#Domain";

/**
 * @description
 * @description default application boot loader */
export default class Main {
	static #instance?: Main;

	#isRunning: boolean = false;
	#hasError: boolean = false;
	readonly #logger = new Logger(secrets.SERVICE_NAME);
	readonly #daemons: SystemDaemon[];
	readonly #bus: DomainEventBus;

	constructor(bus: DomainEventBus, daemons: SystemDaemon[]) {
		if (Main.#instance !== undefined) return Main.#instance;
		else Main.#instance = this;

		this.#logger.info("██████ STARTING APPLICATION ██████");
		if (NODE_ENV === "development") this.#logger.info("👽 DEV MODE 👽");
		if (NODE_ENV === "testing") this.#logger.info("🪲 TEST MODE 🪲");
		if (NODE_ENV === "production") this.#logger.info("🔥 ON 🔥");
		this.#daemons = daemons;
		process.on("SIGTERM", this.#shutdown);
		process.on("SIGINT", this.#shutdown);
		this.#bus = bus
			// System
			.on(Actions.SYSTEM_SHUTDOWN, this.#shutdown)
			.on(Actions.SYSTEM_REBOOT, this.#reboot);
	}

	public readonly boot = async (): Promise<void> => {
		if (this.#isRunning) return;
		try {
			await Promise.all(this.#daemons.map((d) => d.start()));
			this.#logger.info(this.#daemons.length + ` system daemons started successfully`);
			this.#isRunning = true;
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
		this.#isRunning = false;
		const daemonsStoped = await Promise.allSettled(this.#daemons.map((d) => d.stop()));
		for (const d of daemonsStoped) {
			if (d.status === "rejected") this.#logger.error("daemon stop protocol failed", d.reason);
			else this.#logger.info("daemon stoped");
		}
		this.#bus.removeAllListeners();
		process.removeAllListeners();
		this.#logger.info("Shudown protocol successfully");
		return process.exit(this.#hasError ? 1 : 0);
	};
}
