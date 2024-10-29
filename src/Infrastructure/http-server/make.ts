import { type Environment, SECRETS, isDebug } from "../../Domain/System.js";
import { Logger } from "../../Applications/shared/logger-handler/make.js";
import { ModuleException } from "../../Domain/core/errors.factory.js";

import type { IServer } from "../../Domain/IServer";
import type { AuthRouterExpress } from "../../Applications/auth/infrastructure/auth-express.router.js";
import type { AuthRouterFastify } from "../../Applications/auth/infrastructure/auth-fastify.router.js";
import type { UsersRouterExpress } from "../../Applications/users/infrastructure/users-express.router.js";
import type { UsersRouterFastify } from "../../Applications/users/infrastructure/users-fastify.router.js";

const getHttpServerInstance = async (): Promise<IServer> => {
	let _instance: IServer | undefined;

	const message: Record<Environment, string> = {
		development: "👽 DEV MODE 👽",
		test: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	} as const;

	if (SECRETS.HTTP_SERVICE === "fastify") {
		const [{ default: Fastify }, { FastifyServer }, { getAuthRouter }, { getUsersRouter }] = await Promise.all([
			import("fastify"),
			import("./fastify.server.js"),
			import("../../Applications/auth/make.js"),
			import("../../Applications/users/make.js"),
		]);

		const [auth, users] = await Promise.all([getAuthRouter<AuthRouterFastify>(), getUsersRouter<UsersRouterFastify>()]);
		_instance = new FastifyServer({
			app: Fastify({ logger: isDebug }),
			port: +SECRETS.PORT,
			message: message[SECRETS.NODE_ENV],
			applications: [...auth.getRoutes(), ...users.getRoutes()],
			logger: new Logger("FastifyServer"),
			isDebug,
		});
	}

	if (SECRETS.HTTP_SERVICE === "express") {
		const [{ default: Express, Router }, { ExpressServer }, { globalMiddlewares, lastMiddlewares }, { getAuthRouter }, { getUsersRouter }] =
			await Promise.all([
				import("express"),
				import("./express.server.js"),
				import("./middlewares/make.js"),
				import("../../Applications/auth/make.js"),
				import("../../Applications/users/make.js"),
			]);

		const router = Router();
		const [auth, users] = await Promise.all([getAuthRouter<AuthRouterExpress>(), getUsersRouter<UsersRouterExpress>()]);
		_instance = new ExpressServer({
			app: Express(),
			port: +SECRETS.PORT,
			message: message[SECRETS.NODE_ENV],
			globalMiddlewares,
			applications: [auth.getRouter(router), users.getRouter(router)],
			lastMiddlewares,
			logger: new Logger("ExpressServer"),
			isDebug,
		});
	}

	if (_instance === undefined) throw new ModuleException("HttpServer: instance undefined", 500);
	return await Promise.resolve(_instance);
};

export const httpServer = await getHttpServerInstance();
