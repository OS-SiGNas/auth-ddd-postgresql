import type { ILogger } from "./ILogger";

export interface Core {
	readonly isDebug: boolean;
	readonly logger: ILogger;
}
