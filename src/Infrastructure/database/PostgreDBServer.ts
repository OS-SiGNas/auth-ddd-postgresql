import type { DataSource } from "typeorm";
import type { IServer } from "../../Domain/IServer";
import { ILogger } from "../../Domain/core/ILogger";

interface Dependences {
	db: DataSource;
	logger: ILogger;
}

export default class _PostgreDBServer implements IServer {
	readonly #database: DataSource;
	#connection?: DataSource;
	readonly #logger: ILogger;

	constructor(d: Readonly<Dependences>) {
		this.#database = d.db;
		this.#logger = d.logger;
	}

	public readonly start = async (): Promise<void> => {
		this.#logger.info("Starting connection");
		this.#connection = await this.#database.initialize();
		if (this.#connection !== undefined) this.#logger.info("Connection success");
	};

	public readonly stop = (): void => {
		this.#database.destroy();
		this.#connection?.destroy();
	};

	public readonly restart = async (): Promise<void> => {
		console.info("restarting");
		await Promise.resolve();
	};
}
