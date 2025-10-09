import type { ILogger } from "./ILogger.js";

interface Session {
    token: string;
    userId: string;
    roles: string;
}

export interface Transaction {
    id: string;
    session: Session;
    logger: ILogger;
    payload: {
        body?: object;
        query?: object;
        params?: object;
    };
}
