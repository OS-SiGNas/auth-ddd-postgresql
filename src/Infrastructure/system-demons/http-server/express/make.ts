import Express, { Router, json } from "express";
import cors from "cors";
import helmet from "helmet";

import { DEBUG_MODE, secrets } from "#Config";
import { Logger } from "#common/logger-handler/make.js";
import { getNetworkPort } from "../getNetworkPort.js";
import { setCorrelationId } from "./middlewares/setCorrelationId.middleware.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorsCatcher } from "./middlewares/errorCatcher.middleware.js";
import { ExpressServer } from "./express.server.js";
// v1
import { getAuthApp } from "#auth/v1/make.js";
import { getUsersApp } from "#users/v1/make.js";

import type { RequestHandler } from "express";
import type { AuthRouterExpress } from "#auth/v1/infrastructure/auth-express.router";
import type { UsersRouterExpress } from "#users/v1/infrastructure/users-express.router";
import { argv } from "node:process";

export const getExpressServer = async (): Promise<ExpressServer> => {
	const eRouter = Router();

	const _v1 = async (): Promise<RequestHandler[]> => {
		const [auth, users] = await Promise.all([
			getAuthApp<AuthRouterExpress>(), // 0
			getUsersApp<UsersRouterExpress>(), // 1
		]);

		return [auth.getRouter(eRouter), users.getRouter(eRouter)];
	};

	const globalMiddlewares = [
		// Hierarchical order
		cors(),
		helmet(),
		setCorrelationId,
		requestLogger,
		json(),
	];

	const lastMiddlewares = [notFound, errorsCatcher];

	return new ExpressServer({
		logger: new Logger("ExpressServer"),
		DEBUG_MODE,
		app: Express(),
		port: getNetworkPort(argv[2] ?? secrets.PORT),
		globalMiddlewares,
		apis: [await _v1() /* , await _v2() */],
		lastMiddlewares,
	});
};
