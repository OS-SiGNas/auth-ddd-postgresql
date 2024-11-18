import type { DataSource } from "typeorm";
import type { IServer } from "#Domain/IServer";
import { ILogger } from "#Domain/core/ILogger";

interface Dependences {
	dataSource: DataSource;
	logger: ILogger;
}

export class _PostgreServer implements IServer {
	static #instance?: _PostgreServer;
	static getInstance = (d: Dependences): Readonly<_PostgreServer> => (this.#instance ??= new _PostgreServer(d));

	#connection?: DataSource;
	readonly #dataSource: DataSource;
	readonly #logger: ILogger;

	private constructor(d: Readonly<Dependences>) {
		this.#dataSource = d.dataSource;
		this.#logger = d.logger;
	}

	public readonly start = async (): Promise<void> => {
		this.#logger.info("Starting connection");
		this.#connection = await this.#dataSource.initialize();
		if (this.#connection !== undefined) this.#logger.info("Connection success");
	};

	public readonly stop = (): void => {
		this.#dataSource.destroy();
		this.#connection?.destroy();
	};

	public readonly restart = async (): Promise<void> => {
		console.info("restarting");
		await Promise.resolve();
	};
}
