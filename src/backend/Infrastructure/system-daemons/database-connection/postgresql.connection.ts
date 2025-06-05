import type { DataSource } from "typeorm";

import type { SystemDaemon, ILogger } from "#Domain";

interface Dependencies {
	dataSource: DataSource;
	retryTime: number;
	logger: ILogger;
}

type GetSingleton = (d: Dependencies) => Readonly<_PostgreConnection>;

export class _PostgreConnection implements SystemDaemon {
	static #instance?: _PostgreConnection;
	static getInstance: GetSingleton = (d) => (this.#instance ??= new _PostgreConnection(d));

	#isRunning: boolean;
	#connection?: DataSource;
	readonly #dataSource: DataSource;
	readonly #logger: ILogger;
	readonly #maximunRetryTime: number;
	#timeOutRetrying?: NodeJS.Timeout;
	#nextTry = 60000;

	private constructor(d: Readonly<Dependencies>) {
		this.#isRunning = false;
		this.#dataSource = d.dataSource;
		this.#logger = d.logger;
		this.#maximunRetryTime = d.retryTime;
	}

	public readonly start = async (): Promise<void> => {
		if (this.#isRunning) return;
		this.#logger.info("Starting database connection");
		if (this.#timeOutRetrying !== undefined) clearTimeout(this.#timeOutRetrying);
		try {
			this.#connection ??= await this.#dataSource.initialize();
		} catch (error) {
			if (error instanceof AggregateError) {
				error.errors.forEach((e) => this.#logger.error(e.message));
				this.#timeOutRetrying = setTimeout(async () => await this.restart(), this.#nextTry);
				this.#logger.debug(`Next try connection in: ${this.#nextTry / 1000}s`);
			} else throw error;
		} finally {
			if (this.#connection !== undefined) {
				this.#isRunning = true;
				this.#logger.info("Daemon started");
			}
		}
	};

	public readonly stop = async (): Promise<void> => {
		if (!this.#isRunning) return;
		await this.#connection?.destroy().then(() => (this.#connection = undefined));
		this.#logger.warn("Connection stoped");
	};

	public readonly restart = async (): Promise<void> => {
		if (this.#maximunRetryTime > this.#nextTry) this.#nextTry += 60000;
		this.#logger.warn("Restarting");
		await this.stop();
		await Promise.resolve(this.start());
	};
}
