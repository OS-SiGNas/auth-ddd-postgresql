export interface IServer {
	readonly start: () => Promise<void>;
	readonly restart: () => Promise<void>;
	readonly stop: () => void;
}
