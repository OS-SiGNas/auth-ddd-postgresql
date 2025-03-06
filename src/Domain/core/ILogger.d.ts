type Log = (message: string, ...meta: unknown[]) => void;
export interface ILogger {
	readonly info: Log;
	readonly warn: Log;
	readonly debug: Log;
	readonly error: Log;
}

type LoggerConstructor = new (name: string) => ILogger;
