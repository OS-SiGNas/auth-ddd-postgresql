import { ILogger } from "../../Domain/core/ILogger";
import type { IStorageHandler } from "../../Domain/IStorageHandler";

interface Dependences {
  logger: ILogger;
  keyExpiredTime: number;
  cacheExpiredTime: number;
}

export class StorageHandler implements IStorageHandler {
  public readonly name = `[${this.constructor.name}]`;
  readonly #logger: ILogger;
  #storage: Map<string, { createdAt: number; value: unknown }>;
  // #cacheExpiredTime:number

  constructor(d: Readonly<Dependences>) {
    this.#logger = d.logger;
    this.#storage = new Map();

    setInterval(async () => {
      this.#logger.debug(`${this.name}: ${this.#storage.size} numbers of entries in storage`);
      // this.#storage.forEach((element) => { });
      this.#storage.clear();
      this.#logger.debug(this.name + ": map is clear");
    }, d.cacheExpiredTime);
  }

  get = async <T>(key: string): Promise<T | null> => {
    const o = this.#storage.get(key);
    if (o === undefined) return null;
    else return Promise.resolve(o) as T;
  };

  /**
   * @param key unique string identify
   * @param value data */
  set = async (key: string, value: unknown): Promise<void> => {
    this.#storage.set(key, { createdAt: Date.now(), value });
  };
}
