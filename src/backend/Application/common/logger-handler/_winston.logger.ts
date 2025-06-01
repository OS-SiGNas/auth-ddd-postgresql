import { env } from "node:process";
import { createLogger, format, transports } from "winston";
import type { ILogger, LoggerConstructor, Log } from "#Domain";

export const WinstonLogger = ((): LoggerConstructor => {
	const { combine, colorize, timestamp, printf, align } = format;
	const _winston = createLogger({
		level: env.LOG_LEVEL ?? "debug",
		transports: [new transports.Console()],
		format: combine(
			colorize({ all: true }),
			timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
			align(),
			printf(({ timestamp, level, message }) => `[${timestamp}][${level}]: ${message}`)
		),
	});

	return class implements ILogger {
		readonly #name: string;
		constructor(name: string) {
			this.#name = name;
		}

		public readonly info: Log = (message, ...meta): void => {
			_winston.info(`🟡 [${this.#name}] ${message}`);
			if (meta.length >= 1) console.error(...meta);
		};

		public readonly warn: Log = (message, ...meta): void => {
			_winston.warn(`🟠 [${this.#name}] ${message}`);
			if (meta.length >= 1) console.error(...meta);
		};

		public readonly error: Log = (message, ...meta): void => {
			_winston.error(`🔴 [${this.#name}] ${message}`);
			if (meta.length >= 1) console.error(...meta);
		};

		public readonly debug: Log = (message, ...meta): void => {
			_winston.debug(`🔵 [${this.#name}] ${message}`);
			if (meta.length >= 1) console.error(...meta);
		};
	};
})();
