import type { LoggerConstructor, ILogger, Level, LogObject } from "#Domain";
import type { Transport } from "./Transport.js";

export const _GetLogan = (...transports: Transport[]): LoggerConstructor => {
	const _execTransport = async (l: LogObject, ...meta: unknown[]): Promise<void> => {
		await Promise.all(transports.map((t) => t.exec(l, ...meta)));
	};

	const _getDate = (): string => new Date().toISOString();
	const _parse = (level: Level, name: string, message: string): LogObject => ({ level, date: _getDate(), name, message });

	return class implements ILogger {
		readonly #name: string;

		constructor(name: string) {
			this.#name = name;
		}

		public readonly info: ILogger["info"] = (message) => {
			const o = _parse("INFO", this.#name, message);
			void _execTransport(o);
		};

		public readonly warn: ILogger["warn"] = (message) => {
			const o = _parse("WARN", this.#name, message);
			void _execTransport(o);
		};

		public readonly error: ILogger["error"] = (message, ...meta) => {
			const o = _parse("ERROR", this.#name, message);
			void _execTransport(o, ...meta);
		};

		public readonly fatal: ILogger["info"] = (message, ...meta) => {
			const o = _parse("FATAL", this.#name, message);
			void _execTransport(o, ...meta);
		};

		public readonly debug: ILogger["debug"] = (message, ...meta) => {
			const o = _parse("DEBUG", this.#name, message);
			void _execTransport(o, ...meta);
		};
	};
};
