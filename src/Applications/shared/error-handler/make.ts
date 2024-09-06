import { _ErrorHandler } from "./_error.handler.js";
import { logger } from "../logger-handler/make.js";

export const errorHandler = _ErrorHandler.getInstance({ logger });
