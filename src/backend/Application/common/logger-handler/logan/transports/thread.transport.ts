import { Worker } from "node:worker_threads";

import { secrets } from "#Config";

import type { Transport } from "../Transport.d.ts";

export const threadTransport: Transport = new (class {
	readonly #worker: Worker;
	constructor() {
		this.#worker = new Worker(secrets.LOGGER_WORKER_FILE)
			// listeners
			.on("messageerror", this.#catch)
			.on("message", this.#message)
			.on("error", this.#catch)
			.on("exit", this.#exit);
	}

	public readonly exec: Transport["exec"] = (l, ...meta) => this.#worker.postMessage({ l, ...meta });

	readonly #log = (s: string, ...others: unknown[]): void => console.log("[worker]: " + s, ...others);
	readonly #exit = (code: number): void => this.#log("exit with code ", code);
	readonly #message = (m: unknown): void => this.#log("message\t-> ", m);
	readonly #catch = (e: Error): void => {
		console.error("██████ ERROR WORKER ██████", "\n\n", e);
	};
})();
