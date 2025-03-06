import type { ILogger } from "./ILogger";

export interface Core {
	readonly DEBUG_MODE: boolean;
	readonly logger: ILogger;
}
