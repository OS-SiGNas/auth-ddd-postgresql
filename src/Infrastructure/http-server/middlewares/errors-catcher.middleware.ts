import { errorHandler } from "#shared/error-handler/make.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { ErrorRequestHandler } from "express";

const name = "ErrorCatcherMiddleware";
const errorCatcherLogger = new Logger(name);

export const errorsCatcher: ErrorRequestHandler = (error, req, res, next) => {
	void errorCatcherLogger.info(`Catched error in ${req.url} id: ${req.headers.uuid}`);
	void errorHandler.catch({ name, error });
	if (error instanceof SyntaxError) return res.status(400).send(error.message);
	void errorCatcherLogger.warn(`undlandled error in request: ${req.originalUrl}`);
	res.status(500).send("something has gone wrong, we are working to resolve it");
	return next();
};
