import type { ILogger } from "./ILogger";

export interface Core {
	readonly DEBUG: boolean;
	readonly logger: ILogger;
}
