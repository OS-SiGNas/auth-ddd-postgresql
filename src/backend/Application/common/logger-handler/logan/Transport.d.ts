import type { LogObject } from "./ILogger.js";

export interface Transport {
    exec: (l: LogObject, ...meta: unknown[]) => void;
}
