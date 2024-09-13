import { _LoggerConsole } from "./_logger-console.js";
import { bold, cyan, yellow } from "./colors.utils.js";

import type { ILogger } from "../../../Domain/core/ILogger.js";

export class Logger implements ILogger {
	readonly #name: string;
	readonly #logger = _LoggerConsole.getInstance();

	constructor(name: string) {
		this.#name = `[${bold(cyan(name))}]: `;
	}

	public readonly info = (text: string): void => {
		this.#logger.info(this.#name, yellow(text));
	};

	public readonly warn = (text: string): void => {
		this.#logger.warn(this.#name, text);
	};

	public readonly debug = (...objects: unknown[]): void => {
		this.#logger.debug(this.#name, ...objects);
	};

	public readonly error = (...errors: unknown[]): void => {
		this.#logger.error(this.#name, ...errors);
	};
}
