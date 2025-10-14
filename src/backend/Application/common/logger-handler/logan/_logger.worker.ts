import { parentPort } from "node:worker_threads";
import { createWriteStream } from "node:fs";
import { Console } from "node:console";
import { styleText } from "node:util";

import type { LogObject } from "#Domain";

interface EventWorker {
	l: LogObject;
	meta?: unknown[];
}

const red = (text: string): string => styleText("red", text);
const green = (text: string): string => styleText("green", text);
const yellow = (text: string): string => styleText("yellow", text);
const cyan = (text: string): string => styleText("cyan", text);
const bgRed = (text: string): string => styleText(["bgRed", "bold", "white"], text);
const bgGrey = (text: string): string => styleText(["bgBlack", "white"], text);

new (class LoggerWorker {
	#hasError: boolean = false;
	readonly #chunks: Set<LogObject> = new Set();
	readonly #interval: NodeJS.Timeout;
	readonly #file = new Console(
		// stream logs files
		createWriteStream("./stdout.log"),
		createWriteStream("./stderr.log")
	);

	constructor() {
		try {
			if (parentPort === null) throw new (class ThreadWorkerError extends Error {})("parent port is null");
			parentPort
				.on("messageerror", (e: Error) => console.error(e))
				.on("close", this.#shutdownWorker)
				.on("message", this.#message);

			process
				.on("SIGINT", () => this.#shutdownWorker)
				.on("SIGTERM", this.#shutdownWorker)
				.on("exit", this.#shutdownWorker);

			const firstLogTimeout = setTimeout(() => {
				this.#log();
				clearTimeout(firstLogTimeout);
			}, 1000);

			this.#interval = global.setInterval(this.#log, 30000);
		} catch (error) {
			this.#hasError = true;
			this.#log();
			console.error(error);
			this.#file.error(error);
			this.#shutdownWorker();
		}
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
				console.info(`${bgGrey(c.date)} 🟢 [${green(c.level)}] [${c.name}] ${green(c.message)}\n`);
				this.#file.info(output);
			}

			if (c.level === "WARN") {
				console.warn(`${bgGrey(c.date)} 🟠 [${yellow(c.level)}] [${c.name}] ${yellow(c.message)}\n`);
				this.#file.warn(yellow(output));
			}

			if (c.level === "DEBUG") {
				console.debug(`${bgGrey(c.date)} 🔵 [${cyan(c.level)}] [${c.name}] ${cyan(c.message)}\n`);
				this.#file.debug(output);
			}

			if (c.level === "ERROR") {
				console.error(`${bgGrey(c.date)} 🛑 [${red(c.level)}] [${c.name}] ${red(c.message)}\n`);
				this.#file.error(output);
			}

			if (c.level === "FATAL") {
				console.error(`${bgGrey(c.date)} 🛑 [${bgRed(c.level)}] [${c.name}] ${red(c.message)}\n`);
				this.#file.error(output);
			}
		}

		this.#chunks.clear();
	};

	readonly #shutdownWorker = (): void => {
		global.clearInterval(this.#interval);
		this.#log();
		process.exit(this.#hasError ? 1 : 0);
	};
})();
