import type { ILogger } from "../../../Domain/core/ILogger";

export class _LoggerConsole implements ILogger {
  static #instance?: _LoggerConsole;
  static getInstance = (): _LoggerConsole => (this.#instance ??= new _LoggerConsole());

  readonly #yellow = (text: string): string => `\x1B[38;5;3m${text}\x1B[39m`;
  readonly #red = (text: string): string => `\x1B[31m${text}\x1B[39m`;
  readonly #cyan = (text: string): string => `\x1B[96m${text}\x1B[39m`;
  // readonly #magenta = (text:string):string =>`\x1B[95m${text}\x1B[39m`
  readonly #dateFormat = (): string => new Date().toISOString();

  public readonly info = (text: string): void => {
    console.info(`🟡 ${this.#yellow(`[INFO] [${this.#dateFormat()}]`)} ::`, text);
  };

  public readonly warn = (text: string): void => {
    console.warn(`🟠 [WARN] [${this.#dateFormat()}] ::`, text);
  };

  public readonly error = (error: unknown): void => {
    console.error(`🛑 ${this.#red(`[ERROR] [${this.#dateFormat()}]`)} ::`, error);
  };

  public readonly debug = (object: unknown): void => {
    console.debug(`🔵 ${this.#cyan(`[DEBUG] [${this.#dateFormat()}]`)} ::`, object);
  };
}
