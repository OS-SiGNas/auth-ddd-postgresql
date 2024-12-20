import { red, yellow, bold, blue } from "./colors.utils.js";

import type { ILogger } from "#Domain/core/ILogger.js";

export const Logger = (() => {
	const date = (): string => `[${new Date().toLocaleString(undefined, { hour12: false })}]`;

	const info = (message: string, ...meta: unknown[]): void => {
		const strTag = bold(yellow("[INFO]"));
		const strDate = yellow(date());
		console.info(`🟡 ${strTag}  ${strDate} :: ${message}`, ...meta);
	};

	const warn = (message: string, ...meta: unknown[]): void => {
		const strTag = bold(yellow("[WARN] "));
		const strDate = yellow(date());
		console.warn(`🟠 ${strTag} ${strDate} :: ${message}`, ...meta);
	};

	const error = (...error: unknown[]): void => {
		const strTag = bold(red("[ERROR]"));
		const strDate = red(date());
		console.error(`🛑 ${strTag} ${strDate} ::`, ...error);
	};

	const debug = (...object: unknown[]): void => {
		const strTag = bold(blue("[DEBUG]"));
		const strDate = blue(date());
		console.debug(`🔵 ${strTag} ${strDate} ::`, ...object);
	};

	return class Logger implements ILogger {
		readonly #name: string;

		constructor(name: string) {
			this.#name = `[${bold(blue(name))}]: `;
		}

		public readonly info = (text: string): void => {
			info(this.#name, yellow(text));
		};

		public readonly warn = (text: string): void => {
			warn(this.#name, text);
		};

		public readonly debug = (...objects: unknown[]): void => {
			debug(this.#name, ...objects);
		};

		public readonly error = (...errors: unknown[]): void => {
			error(this.#name, ...errors);
		};
	};
})();
