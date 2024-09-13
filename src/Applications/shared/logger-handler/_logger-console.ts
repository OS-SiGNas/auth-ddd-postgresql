import { cyan, red, yellow, bold } from "./colors.utils.js";

import type { ILogger } from "../../../Domain/core/ILogger.js";

export class _LoggerConsole implements ILogger {
	static #instance?: _LoggerConsole;
	static getInstance = (): _LoggerConsole => (this.#instance ??= new _LoggerConsole());

	readonly #date = (): string => new Date().toISOString();

	public readonly info = (...text: string[]): void => {
		console.info(`🟡 ${bold(yellow(`[INFO]  [${this.#date()}]`))} ::`, ...text);
	};

	public readonly warn = (...text: string[]): void => {
		console.warn(`🟠 ${bold(`[WARN]  [${this.#date()}] ::`)}`, ...text);
	};

	public readonly error = (...error: unknown[]): void => {
		console.error(`🛑 ${bold(red(`[ERROR] [${this.#date()}]`))} ::`, ...error);
	};

	public readonly debug = (...object: unknown[]): void => {
		console.debug(`🔵 ${bold(cyan(`[DEBUG] [${this.#date()}]`))} ::`, ...object);
	};
}
