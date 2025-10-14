import { stdout, stderr } from "node:process";
import { Console } from "node:console";
import { cyan, red, yellow, green, white, bgRed } from "../../colors.utils.js";
import type { LogObject } from "#Domain";
import type { Transport } from "../Transport.js";

/**
 * @description singleton transport stdout */
export class _StdOutTransport implements Transport {
	static #instance?: _StdOutTransport;
	constructor() {
		if (_StdOutTransport.#instance !== undefined) return _StdOutTransport.#instance;
		else _StdOutTransport.#instance = this;
	}

	readonly #log = new Console(stdout, stderr).log;
	readonly #logLevel = (l: LogObject): string => `[${l.level}] [${l.date}]`;
	readonly #logName = (name: string): string => `[${white(name)}]: \n	`;

	readonly #info = (l: LogObject): void => {
		this.#log(`🟢 ${green(this.#logLevel(l))} ${this.#logName(l.name)} ${green(l.message)}\n`);
	};

	readonly #warn = (l: LogObject): void => {
		this.#log(`🟠 ${yellow(this.#logLevel(l))} ${this.#logName(l.name)} ${yellow(l.message)}\n`);
	};

	readonly #debug = (l: LogObject, ...meta: unknown[]): void => {
		const message = `🔵 ${cyan(this.#logLevel(l))} ${this.#logName(l.name)} ${cyan(l.message)}\n`;
		this.#log(message);
		if (meta.length !== 0) this.#log(...meta, "\n");
	};

	readonly #error = (l: LogObject, ...meta: unknown[]): void => {
		const message = `🛑 ${red(this.#logLevel(l))} ${this.#logName(l.name)} ${red(l.message)}\n`;
		this.#log(message);
		if (meta.length !== 0) this.#log(...meta, "\n");
	};

	readonly #fatal = (l: LogObject, ...meta: unknown[]): void => {
		const message = `💀 ${bgRed(this.#logLevel(l))} ${this.#logName(l.name)} ${bgRed(l.message)}\n`;
		this.#log(message);
		if (meta.length !== 0) this.#log(...meta, "\n");
	};

	public readonly exec: Transport["exec"] = async (l: LogObject, ...meta): Promise<void> => {
		if (l.level === "INFO") this.#info(l);
		if (l.level === "WARN") this.#warn(l);
		if (l.level === "DEBUG") this.#debug(l, ...meta);
		if (l.level === "ERROR") this.#error(l, ...meta);
		if (l.level === "FATAL") this.#fatal(l, ...meta);
		return Promise.resolve();
	};
}
