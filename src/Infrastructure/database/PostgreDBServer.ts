import type { DataSource } from "typeorm";
import type { IServer } from "../../Domain/IServer";

interface Dependences {
  db: DataSource;
}

export default class _PostgreDBServer implements IServer {
  readonly #database: DataSource;

  constructor(d: Readonly<Dependences>) {
    this.#database = d.db;
  }

  public readonly start = async (): Promise<void> => {
    await this.#database.initialize();
  };

  public readonly stop = async (): Promise<void> => {
    this.#database.destroy();
    await Promise.resolve(process.exit(0));
  };

  public readonly restart = async (): Promise<void> => {
    console.info("restarting");
    await Promise.resolve();
  };
}
