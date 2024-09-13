import { ENVIRONMENT, Environment, secrets } from "../../Domain/System.js";

import { errorHandler } from "../../Applications/shared/error-handler/make.js";
import { Logger } from "../../Applications/shared/logger-handler/logger.js";

import { auth } from "../../Applications/auth/make.js";
import { users } from "../../Applications/users/make.js";

import type { IServer } from "../../Domain/IServer";

const getHttpServerInstance = async (): Promise<IServer> => {
	let instance: IServer | undefined;

	const message: Record<Environment, string> = {
		development: "👽 DEV MODE 👽",
		test: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	} as const;

	if (secrets.HTTP_SERVICE === "fastify") {
		const Fastify = await import("fastify");
		const { FastifyServer } = await import("./FastifyServer");
		instance = new FastifyServer({
			name: "fastifyServer",
			app: Fastify(),
			port: +secrets.PORT,
			message: message[ENVIRONMENT],
			errorHandler,
			logger: new Logger("FastifyServer"),
		});
	}

	if (secrets.HTTP_SERVICE === "express") {
		const { default: Express } = await import("express");
		const { ExpressServer } = await import("./ExpressServer.js");
		const { globalMiddlewares, lastMiddlewares } = await import("./middlewares/make.js");
		instance = new ExpressServer({
			name: "expressServer",
			app: Express(),
			port: +secrets.PORT,
			message: message[ENVIRONMENT],
			globalMiddlewares,
			applications: [auth, users],
			lastMiddlewares,
			errorHandler,
			logger: new Logger("ExpressServer"),
		});
	}

	if (instance === undefined) throw new Error("HttpServerError: instance undefined");
	else return await Promise.resolve(instance);
};

export const httpServer = await getHttpServerInstance();
