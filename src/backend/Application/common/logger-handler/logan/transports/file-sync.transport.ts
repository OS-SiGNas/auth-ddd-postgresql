import { Console } from "node:console";
import { createWriteStream } from "node:fs";

import type { Transport } from "../Transport.js";

/**
 * @description singleton transport for writeable stream .log file */
export class FileSyncTransport implements Transport {
	static #instance?: FileSyncTransport;

	readonly #logger: Console["log"];

	constructor() {
		if (FileSyncTransport.#instance !== undefined) return FileSyncTransport.#instance;
		else FileSyncTransport.#instance = this;

		const date = new Date().toISOString();
		const stdout = createWriteStream(`./logs/${date}_stdout.log`);
		const stderr = createWriteStream(`./logs/${date}_stderr.log`);
		this.#logger = new Console(stdout, stderr).log;
	}

	get log(): Console["log"] {
		return this.#logger;
	}

	public readonly exec: Transport["exec"] = async (l, ...meta) => {
		this.#logger(`${l.level}\t${l.date}\t${l.name}\t${l.message}`);
		if (meta.length === 0) return await Promise.resolve();
		for (const out of meta) this.#logger(out instanceof Error ? String(out.stack) : String(out));
		return await Promise.resolve();
	};
}
