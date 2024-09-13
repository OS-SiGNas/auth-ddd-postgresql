export interface ILogger {
	readonly info: (text: string) => void;
	readonly warn: (text: string) => void;
	readonly debug: (...object: unknown[]) => void;
	readonly error: (...error: unknown[]) => void;
}
