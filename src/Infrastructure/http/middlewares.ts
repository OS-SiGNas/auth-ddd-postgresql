import { json } from "express";
import cors from "cors";
import { notFound } from "../../Applications/notFound/NotFound.js";
import { errorHandler } from "../../Applications/shared/error-handler/make.js";
import { logger } from "../../Applications/shared/logger-handler/make.js";

import type { ErrorRequestHandler, RequestHandler } from "express";

const errorHandlerMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  logger.debug(`undlandled error in request: ${req.originalUrl}`);
  errorHandler.catch("ErrorHandlerMiddleware", error);
  res.status(500).send("something has gone wrong, we are working to resolve it");
  next();
};

// Add middlewares in order in their respective array
export const globalMiddlewares: RequestHandler[] = [cors(), json()];

export const lastMiddlewares: Array<RequestHandler | ErrorRequestHandler> = [notFound, errorHandlerMiddleware];
