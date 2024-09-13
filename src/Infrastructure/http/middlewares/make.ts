import cors from "cors";
import helmet from "helmet";
import { json } from "express";

import { notFound } from "../../../Applications/notFound/NotFound.js";

import { requestLogger } from "./request-logger.middleware.js";
import { errorCatcher } from "./errors-catcher.middleware.js";

import type { ErrorRequestHandler, RequestHandler } from "express";

// Add middlewares in order in their respective array
export const globalMiddlewares: RequestHandler[] = [cors(), helmet(), requestLogger, json()];
export const lastMiddlewares: Array<RequestHandler | ErrorRequestHandler> = [notFound, errorCatcher];
