import { errorHandler } from "../../../Applications/shared/error-handler/make.js";
import { Logger } from "../../../Applications/shared/logger-handler/logger.js";

import type { ErrorRequestHandler } from "express";

const errorCatcherLogger = new Logger("ErrorCatcherMiddleware");

export const errorCatcher: ErrorRequestHandler = (error, req, res, _next) => {
	errorCatcherLogger.info(`Catched error in ${req.url} id: ${req.headers.uuid}`);
	errorHandler.catch("ErrorHandlerMiddleware", error);
	if (error instanceof SyntaxError) return res.status(400).send(error.message);
	errorCatcherLogger.debug(`undlandled error in request: ${req.originalUrl}`);
	return res.status(500).send("something has gone wrong, we are working to resolve it");
	_next();
};
