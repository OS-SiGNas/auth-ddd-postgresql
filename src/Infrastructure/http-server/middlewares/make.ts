import cors from "cors";
import helmet from "helmet";
import { json } from "express";

import { requestLogger } from "./request-logger.middleware.js";
import { errorsCatcher } from "./errors-catcher.middleware.js";
import { notFound } from "./notFound.middleware.js";

import type { ErrorRequestHandler, RequestHandler } from "express";

// Add middlewares in order in their respective array
export const globalMiddlewares: RequestHandler[] = [cors(), helmet(), requestLogger, json()];

export const lastMiddlewares: Array<RequestHandler | ErrorRequestHandler> = [notFound, errorsCatcher];
