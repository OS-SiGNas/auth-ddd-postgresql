import { parentPort } from "node:worker_threads";
import { createWriteStream } from "node:fs";
import { Console } from "node:console";

import type { LogObject } from "#Domain";

interface EventWorker {
	l: LogObject;
	meta?: unknown[];
}

void new (class LoggerWorker {
	readonly #chunks: Set<string> = new Set();
	readonly #interval: NodeJS.Timeout;
	readonly #logger = new Console(
		// stream logs files
		createWriteStream("./stdout.log"),
		createWriteStream("./stderr.log")
	);

	constructor() {
		if (parentPort === null) throw new (class ThreadWorkerError extends Error {})("parent port is null");
		parentPort.on("message", this.#message);
		process.on("exit", this.#exit);
		this.#interval = global.setInterval(this.#log, 1000);
	}

	readonly #log = (): void => {
		if (this.#chunks.size === 0) return;
		this.#logger.log(...this.#chunks);
		this.#chunks.clear();
	};

	readonly #message = async ({ l, meta }: EventWorker): Promise<void> => {
		if (meta !== undefined) console.debug(meta);
		const output = `${l.level}\t${l.date}\t${l.name}\t${l.message}`;
		console.log(output);
		this.#chunks.add(output);
	};

	readonly #exit = (): void => {
		global.clearInterval(this.#interval);
		this.#log();
	};
})();
