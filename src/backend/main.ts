import { DEBUG, NODE_ENV } from "#Config";
import { Actions } from "#Domain";
import type { DomainEventBus, ILogger, SystemDaemon } from "#Domain";

interface Dependencies {
	daemons: SystemDaemon[];
	bus: DomainEventBus;
	logger: ILogger;
}

/**
 * @description
 * @description default application boot loader */
export class _Main {
	static #instance?: _Main;

	readonly #daemons: SystemDaemon[];
	readonly #bus: DomainEventBus;
	readonly #logger: ILogger;
	#hasError: boolean = false;
	constructor(d: Readonly<Dependencies>) {
		if (_Main.#instance !== undefined) return _Main.#instance;
		else _Main.#instance = this;
		if (d.daemons.length === 0) {
			this.#logger.warn("system daemons empty");
			this.#shutdown();
		} else {
			this.#daemons = d.daemons;
			this.#logger = d.logger;
			process.on("SIGTERM", this.#shutdown);
			process.on("SIGINT", this.#shutdown);
			this.#bus = d.bus // 🧨
				.on(Actions.SYSTEM_SHUTDOWN, this.#shutdown)
				.on(Actions.SYSTEM_REBOOT, this.#reboot);
		}
	}

	public readonly boot = async (): Promise<void> => {
		this.#logger.info("██████ STARTING APPLICATION ██████");
		if (NODE_ENV === "development") this.#logger.info("👽 DEV MODE 👽");
		if (NODE_ENV === "testing") this.#logger.info("🪲 TEST MODE 🪲");
		if (NODE_ENV === "production") this.#logger.info("🔥 ON 🔥");
		try {
			await Promise.all(this.#daemons.map((d) => d.start()));
			this.#logger.info(this.#daemons.length + ` system daemons started successfully`);
			const { subscribers } = await import("./subscribers.js");
			return await Promise.resolve(subscribers(this.#bus));
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
		if (this.#daemons.length !== 0) {
			const daemonsSettled = Promise.allSettled(this.#daemons.map((d) => d.stop()));
			for (const d of await daemonsSettled) {
				if (d.status === "rejected") this.#logger.error("daemon stop protocol failed", d.reason);
				else this.#logger.info("daemon stoped");
			}
		}
		this.#bus.removeAllListeners();
		process.removeAllListeners();
		this.#logger.info("Shudown protocol successfully");
		return process.exit(this.#hasError ? 1 : 0);
	};
}
