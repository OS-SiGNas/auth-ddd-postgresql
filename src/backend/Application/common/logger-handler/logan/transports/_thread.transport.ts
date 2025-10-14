import { Worker } from "node:worker_threads";
import type { Transport } from "../Transport.js";

export class _ThreadTransport {
	static #instance?: _ThreadTransport;
	readonly #worker: Worker;
	constructor(file: string) {
		if (_ThreadTransport.#instance !== undefined) return _ThreadTransport.#instance;
		else _ThreadTransport.#instance = this;

		this.#worker = new Worker(file)
			// listeners
			.on("message", (m: unknown) => this.#log("message\t-> ", m))
			.on("messageerror", this.#catch)
			.on("error", this.#catch)
			.on("exit", this.#exit);

		process.on("exit", this.#shutdown);
	}

	readonly #log = (s: string, ...others: unknown[]): void => console.log("[ThreadTransport]: " + s, ...others);
	readonly #exit = (code: number): void => this.#log("exit with code ", code);
	readonly #catch = (e: Error): void => console.error("\n\n██████ ERROR THREAD TRANSPORT ██████\n\n", e);
	readonly #shutdown = async (): Promise<void> => {
		this.#worker.removeAllListeners();
		this.#log("exit with code: ", await this.#worker.terminate());
	};

	public readonly exec: Transport["exec"] = (l, ...meta) => this.#worker.postMessage({ l, ...meta });
}
