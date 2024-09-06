import type { IErrorHandler } from "./IErrorHandler";
import type { ILogger } from "./ILogger";

export interface Core {
  readonly name: string;
  readonly errorHandler: IErrorHandler;
  readonly logger: ILogger;
}
