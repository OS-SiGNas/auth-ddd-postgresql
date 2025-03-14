import { clearInterval } from "node:timers";

import type { Core } from "#Domain/core/Core";
import type { ILogger } from "#Domain/core/ILogger";
import type { ICacheHandler } from "#Domain/tools/ICacheHandler";

interface Dependences extends Core {
	keyExpiredTime: number;
	cacheExpiredTime: number;
}

export class StorageHandler implements ICacheHandler {
	readonly #logger: ILogger;
	readonly #isDebug: boolean;
	readonly #storage: Map<string, { createdAt: number; value: unknown }>;
	readonly #keyExpiredTime: number;

	constructor(d: Readonly<Dependences>) {
		this.#isDebug = d.DEBUG_MODE;
		this.#storage = new Map();
		this.#logger = d.logger;
		this.#keyExpiredTime = d.keyExpiredTime;
		const interval = setInterval(this.#clean, d.cacheExpiredTime);
		process.on("exit", () => {
			clearInterval(interval);
			if (this.#isDebug) this.#logger.debug("Interval cleaned");
		});
	}

	public readonly get = async <T>(key: string): Promise<T | null> => {
		const o = this.#storage.get(key);
		if (o === undefined) return null;
		this.#logger.debug(`Getting ${key}`);
		return Promise.resolve(o.value) as T;
	};

	public readonly set = async (key: string, value: unknown): Promise<void> => {
		this.#storage.set(key, { createdAt: Date.now(), value });
		if (this.#isDebug) this.#logger.info(`Saved in storage: ${key}`);
	};

	public readonly delete = (key: string): Promise<boolean> => {
		const deleted = this.#storage.delete(key);
		if (this.#isDebug) this.#logger.debug(`Key '${key}' deleted?: ${deleted}`);
		return Promise.resolve(deleted);
	};

	readonly #clean = async (): Promise<void> => {
		this.#logger.info(`Cleaning storage with ${this.#storage.size} elements`);
		const now = Date.now();
		/* for (const [key, element] of this.#storage) {
			if (now - element.createdAt > this.#keyExpiredTime) this.#storage.delete(key);
		} */
		this.#storage.forEach((element, key) => {
			if (now - element.createdAt > this.#keyExpiredTime) this.#storage.delete(key);
		});

		this.#logger.info(`Storage cleaned, number of elements: ${this.#storage.size}`);
		return await Promise.resolve(undefined);
	};
}
