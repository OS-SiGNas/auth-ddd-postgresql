import Express, { Router } from "express";
import { IS_DEBUG, secrets } from "#config";
import { Logger } from "#shared/logger-handler/make.js";

import { ExpressServer } from "./express.server.js";
import { globalMiddlewares, lastMiddlewares } from "./middlewares/make.js";
// v1
import { getAuthApp } from "#auth/v1/make.js";
import { getUsersApp } from "#users/v1/make.js";

import type { RequestHandler } from "express";
import type { AuthRouterExpress } from "#auth/v1/infrastructure/auth-express.router";
import type { UsersRouterExpress } from "#users/v1/infrastructure/users-express.router";

export const getExpressServer = async (message: string): Promise<ExpressServer> => {
	const eRouter = Router();

	const _v1 = async (): Promise<RequestHandler[]> => {
		const [auth, users] = await Promise.all([
			getAuthApp<AuthRouterExpress>(), // 0
			getUsersApp<UsersRouterExpress>(), // 1
		]);

		return [auth.getRouter(eRouter), users.getRouter(eRouter)];
	};

	return new ExpressServer({
		app: Express(),
		port: +secrets.PORT,
		message,
		globalMiddlewares,
		apis: [await _v1()],
		lastMiddlewares,
		logger: new Logger("ExpressServer"),
		IS_DEBUG,
	});
};
