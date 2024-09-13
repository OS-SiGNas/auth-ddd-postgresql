import type { IErrorHandler } from "./IErrorHandler";
import type { ILogger } from "./ILogger";

export interface Core {
	readonly errorHandler: IErrorHandler;
	readonly logger: ILogger;
}
