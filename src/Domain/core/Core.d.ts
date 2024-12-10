import type { ILogger } from "./ILogger";

export interface Core {
	readonly IS_DEBUG: boolean;
	readonly logger: ILogger;
}
