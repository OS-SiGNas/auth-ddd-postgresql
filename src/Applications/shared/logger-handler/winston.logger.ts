import { env } from "process";
import { createLogger, format, transports } from "winston";

import type { ILogger } from "../../../Domain/core/ILogger";

export const Logger = (() => {
	const { combine, colorize, timestamp, printf, align } = format;
	const winston = createLogger({
		level: env.LOG_LEVEL ?? "debug",
		transports: [new transports.Console()],
		format: combine(
			colorize({ all: true }),
			timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
			align(),
			printf(({ timestamp, level, message }) => `[${timestamp}][${level}]: ${message}`)
		),
	});

	return class Logger implements ILogger {
		readonly #name: string;

		constructor(name: string) {
			this.#name = name;
		}

		public readonly info = (message: string): void => {
			winston.info(`🟡 [${this.#name}] ${message}`);
		};

		public readonly warn = (message: string): void => {
			winston.warn(`🟠 [${this.#name}] ${message}`);
		};

		public readonly error = (message: string): void => {
			winston.error(`🔴 [${this.#name}] ${message}`);
		};

		public readonly debug = (message: unknown): void => {
			winston.debug(`🔵 [${this.#name}] ${message}`);
		};
	};
})();
