import type { SystemDaemon } from "#Domain";
// import type { Buffer } from "node:buffer";

export class _LoggerListener implements SystemDaemon {
	static #instance?: _LoggerListener;

	readonly #strategy: SystemDaemon;

	constructor(strategy: SystemDaemon) {
		if (_LoggerListener.#instance !== undefined) return _LoggerListener.#instance;
		else _LoggerListener.#instance = this;
		this.#strategy = strategy;
	}

	public readonly start = async (): Promise<void> => {
		return await Promise.resolve(this.#strategy.start());
	};

	public readonly stop = async (): Promise<void> => {
		return await Promise.resolve(this.#strategy.stop());
	};

	public readonly restart = async (): Promise<void> => {
		return await Promise.resolve(this.#strategy.restart());
	};
}
