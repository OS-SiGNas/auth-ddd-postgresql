import { _LoggerConsole } from "./_logger.js";

import type { ILogger } from "../../../Domain/core/ILogger";

export const logger: ILogger = _LoggerConsole.getInstance();
