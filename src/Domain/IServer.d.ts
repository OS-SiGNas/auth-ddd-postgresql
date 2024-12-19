export interface IServer {
	/** Main method to start listening servers*/
	readonly start: () => Promise<void>;

	/** All servers must implement controlled exit logic */
	readonly stop: () => void;

	/** For cases where it is necessary not to interrupt the application boot and it is more convenient to retry to start the server */
	readonly restart: () => Promise<void>;
}
