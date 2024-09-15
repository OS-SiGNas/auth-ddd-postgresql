import { type Environment, type HttpService, secrets } from "../../Domain/System.js";
// Applications share
import { errorHandler } from "../../Applications/shared/error-handler/make.js";
import { Logger } from "../../Applications/shared/logger-handler/logger.js";

import type { IServer } from "../../Domain/IServer";

const { NODE_ENV, HTTP_SERVICE, PORT } = secrets;

const getHttpServerInstance = async (): Promise<IServer> => {
	let _instance: IServer | undefined;
	const _error = (service: HttpService): Error => new Error(`Module not available in '${service}' service`);

	const message: Record<Environment, string> = {
		development: "👽 DEV MODE 👽",
		test: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	} as const;

	if (HTTP_SERVICE === "fastify") {
		const { default: Fastify } = await import("fastify");
		const { FastifyServer } = await import("./fastify.server.js");
		const { authFastify } = await import("../../Applications/auth/make.js");
		if (authFastify === undefined) throw _error(HTTP_SERVICE);
		const { usersFastify } = await import("../../Applications/users/make.js");
		if (usersFastify === undefined) throw _error(HTTP_SERVICE);

		_instance = new FastifyServer({
			app: Fastify({ logger: NODE_ENV !== "production" }),
			port: +PORT,
			message: message[NODE_ENV],
			applications: [...authFastify.getRoutes(), ...usersFastify.getRoutes()],
			errorHandler,
			logger: new Logger("FastifyServer"),
		});
	}

	if (HTTP_SERVICE === "express") {
		const { default: Express, Router } = await import("express");
		const { ExpressServer } = await import("./express.server.js");
		const { globalMiddlewares, lastMiddlewares } = await import("./middlewares/make.js");
		const { authExpress } = await import("../../Applications/auth/make.js");
		if (authExpress === undefined) throw _error(HTTP_SERVICE);
		const { usersExpress } = await import("../../Applications/users/make.js");
		if (usersExpress === undefined) throw _error(HTTP_SERVICE);
		const router = Router();

		_instance = new ExpressServer({
			app: Express(),
			port: +PORT,
			message: message[NODE_ENV],
			globalMiddlewares,
			applications: [authExpress.getRouter(router), usersExpress.getRouter(router)],
			lastMiddlewares,
			errorHandler,
			logger: new Logger("ExpressServer"),
		});
	}

	if (_instance === undefined) throw new Error("HttpServerError: instance undefined");
	else return await Promise.resolve(_instance);
};

export const httpServer = await getHttpServerInstance();
