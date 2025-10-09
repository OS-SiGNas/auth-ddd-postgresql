import { parentPort } from "node:worker_threads";
import { createWriteStream } from "node:fs";
import { Console } from "node:console";
import { styleText } from "node:util";

const red = (text: string): string => styleText("red", text);
const green = (text: string): string => styleText("green", text);
const yellow = (text: string): string => styleText("yellow", text);
const cyan = (text: string): string => styleText("cyan", text);
const bgRed = (text: string): string => styleText(["bgRed", "bold", "white"], text);

import type { LogObject } from "#Domain";

interface EventWorker {
	l: LogObject;
	meta?: unknown[];
}

void new (class LoggerWorker {
	readonly #chunks: Set<LogObject> = new Set();
	readonly #interval: NodeJS.Timeout;
	readonly #file = new Console(
		// stream logs files
		createWriteStream("./stdout.log"),
		createWriteStream("./stderr.log")
	);

	constructor() {
		if (parentPort === null) throw new (class ThreadWorkerError extends Error {})("parent port is null");
		parentPort.on("message", this.#message);
		parentPort.on("close", this.#exit);

		process.on("exit", this.#exit);
		process.on("SIGINT", () => this.#exit);
		process.on("SIGTERM", this.#exit);
		this.#interval = global.setInterval(this.#log, 30000);
	}

	readonly #message = async ({ l, meta }: EventWorker): Promise<void> => {
		if (meta !== undefined) console.debug(meta);
		this.#chunks.add(l);
	};

	readonly #log = (): void => {
		if (this.#chunks.size === 0) return;
		for (const c of this.#chunks) {
			const output = `${c.level}\t${c.date}\t${c.name}\t${c.message}`;

			if (c.level === "INFO") {
				console.info(`🟢 ${green(c.level)} ${c.name} ${green(c.message)}\n`);
				this.#file.info(output);
			}

			if (c.level === "WARN") {
				console.warn(`🟠 ${yellow(c.level)} ${c.name} ${yellow(c.message)}\n`);
				this.#file.warn(yellow(output));
			}

			if (c.level === "DEBUG") {
				console.debug(`🔵 ${cyan(c.level)} ${c.name} ${cyan(c.message)}\n`);
				this.#file.debug(output);
			}

			if (c.level === "ERROR") {
				console.error(`🛑 ${red(c.level)} ${c.name} ${red(c.message)}\n`);
				this.#file.error(output);
			}

			if (c.level === "FATAL") {
				console.error(`🛑 ${bgRed(c.level)} ${c.name} ${red(c.message)}\n`);
				this.#file.error(output);
			}
		}

		this.#chunks.clear();
	};

	readonly #exit = (): void => {
		global.clearInterval(this.#interval);
		this.#log();
		process.exit();
	};
})();
