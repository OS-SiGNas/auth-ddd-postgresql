export type Level = "INFO" | "WARN" | "ERROR" | "DEBUG" | "FATAL";
export type LoggerConstructor = new (name: string) => ILogger;
export type Log = Console["log"];

export interface ILogger {
	readonly info: (text: string) => void;
	readonly warn: (text: string) => void;
	readonly error: (text: string, ...meta: unknown[]) => void;
	readonly fatal: (text: string, ...meta: unknown[]) => void;
	readonly debug: (text: string, ...meta: unknown[]) => void;
}

export interface Transport {
	exec: (l: LogObject, ...meta: unknown[]) => void;
}

export interface LogObject {
	level: Level;
	date: string;
	name: string;
	message: string;
}
