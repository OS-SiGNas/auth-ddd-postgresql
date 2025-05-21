import { red, yellow, bold, blue } from "./colors.utils.js";

import type { ILogger, Log, LoggerConstructor } from "#Domain";

export const ConsoleLogger = ((): LoggerConstructor => {
	const _date = (): string => `[${new Date().toLocaleString(undefined, { hour12: false })}]`;

	const _info: Log = (text, ...meta): void => {
		const tag = yellow("[INFO] ");
		const date = bold(yellow(_date()));
		console.info(`🟡 ${tag} ${date} :: ${text}`, ...meta);
	};

	const _warn: Log = (text, ...meta): void => {
		const tag = red("[WARN] ");
		const date = bold(yellow(_date()));
		console.warn(`🟠 ${tag} ${date} :: ${text}`, ...meta);
	};

	const _error: Log = (text, ...error): void => {
		const tag = red("[ERROR]");
		const date = bold(red(_date()));
		console.error(`🛑 ${tag} ${date} :: ${text}`, ...error);
	};

	const _debug: Log = (text, ...object): void => {
		const tag = blue("[DEBUG]");
		const date = bold(blue(_date()));
		console.debug(`🔵 ${tag} ${date} :: ${text}`, ...object);
	};

	return class implements ILogger {
		readonly #name: string;
		public constructor(name: string) {
			this.#name = `[${bold(blue(name))}]: `;
		}

		public readonly info: Log = (text, ...meta): void => _info(this.#name + text, ...meta);
		public readonly warn: Log = (text, ...meta): void => _warn(this.#name + text, ...meta);
		public readonly debug: Log = (text, ...meta): void => _debug(this.#name + text, ...meta);
		public readonly error: Log = (text, ...meta): void => _error(this.#name + text, ...meta);
	};
})();
