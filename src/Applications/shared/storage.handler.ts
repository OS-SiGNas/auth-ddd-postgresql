import { clearInterval } from "node:timers";

import type { ILogger } from "../../Domain/core/ILogger";
import type { IStorageHandler } from "../../Domain/IStorageHandler";

interface Dependences {
	logger: ILogger;
	keyExpiredTime: number;
	cacheExpiredTime: number;
}

export class StorageHandler implements IStorageHandler {
	readonly #logger: ILogger;
	readonly #storage: Map<string, { createdAt: number; value: unknown }>;
	readonly #keyExpiredTime: number;

	constructor(d: Readonly<Dependences>) {
		this.#storage = new Map();
		this.#logger = d.logger;
		this.#keyExpiredTime = d.keyExpiredTime;
		const interval = setInterval(this.#clean, d.cacheExpiredTime);
		process.on("exit", () => clearInterval(interval));
	}

	public readonly get = async <T>(key: string): Promise<T | null> => {
		const o = this.#storage.get(key);
		if (o === undefined) return null;
		this.#logger.debug(`Getting ${key}`);
		return Promise.resolve(o.value) as T;
	};

	public readonly set = async (key: string, value: unknown): Promise<void> => {
		this.#storage.set(key, { createdAt: Date.now(), value });
		this.#logger.debug(`Saved in storage: ${key}`);
	};

	public readonly delete = (key: string): boolean => {
		const deleted = this.#storage.delete(key);
		this.#logger.debug(`Key '${key}' deleted?: ${deleted}`);
		return deleted;
	};

	readonly #clean = async (): Promise<void> => {
		this.#logger.debug(`Cleaning storage with ${this.#storage.size} elements`);
		const now = Date.now();
		for (const [key, element] of this.#storage) {
			if (now - element.createdAt > this.#keyExpiredTime) this.#storage.delete(key);
		}
		this.#logger.debug(`Storage cleaned, number of elements: ${this.#storage.size}`);
		Promise.resolve();
	};
}