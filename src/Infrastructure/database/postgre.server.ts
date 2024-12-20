import type { DataSource } from "typeorm";
import type { IServer } from "#Domain/IServer";
import type { ILogger } from "#Domain/core/ILogger";

interface Dependences {
	dataSource: DataSource;
	retryTime: number;
	logger: ILogger;
}

export class _PostgreServer implements IServer {
	static #instance?: _PostgreServer;
	static getInstance = (d: Dependences): Readonly<_PostgreServer> => (this.#instance ??= new _PostgreServer(d));

	#connection?: DataSource;
	readonly #dataSource: DataSource;
	readonly #logger: ILogger;
	readonly #maximunRetryTime: number;
	#timeOutRetrying?: NodeJS.Timeout;
	#nextTry = 60000;

	private constructor(d: Readonly<Dependences>) {
		this.#dataSource = d.dataSource;
		this.#logger = d.logger;
		this.#maximunRetryTime = d.retryTime;
	}

	public readonly start = async (): Promise<void> => {
		this.#logger.info("Starting connection");
		try {
			if (this.#timeOutRetrying !== undefined) clearTimeout(this.#timeOutRetrying);
			this.#connection ??= await this.#dataSource.initialize();
		} catch (error) {
			if (error instanceof AggregateError) {
				error.errors.forEach((e) => this.#logger.error(e.message));
				this.#timeOutRetrying = setTimeout(async () => await this.restart(), this.#nextTry);
				this.#logger.debug(`Next try connection in: ${this.#nextTry / 1000}s`);
			} else throw error;
		} finally {
			if (this.#connection !== undefined) this.#logger.info("Connection success");
		}
	};

	public readonly stop = async (): Promise<void> => {
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
