import Fastify from "fastify";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";

import { FastifyServer } from "./fastify.server.js";
import { IS_DEBUG, secrets } from "#Domain/config.js";
import { Logger } from "#shared/logger-handler/make.js";
// v1
import { getAuthRouter } from "#auth/v1/make.js";
import { getUsersRouter } from "#users/v1/make.js";

import type { UsersRouterFastify } from "#users/v1/infrastructure/users-fastify.router";
import type { AuthRouterFastify } from "#auth/v1/infrastructure/auth-fastify.router";
import type { FastifyPluginCallback } from "fastify";

export const getFastifyServer = async (message: string): Promise<FastifyServer> => {
	const v1 = async (): Promise<FastifyPluginCallback[]> => {
		const [auth, users] = await Promise.all([
			getAuthRouter<AuthRouterFastify>(), // 0
			getUsersRouter<UsersRouterFastify>(), // 1
		]);

		return [auth.plugin, users.plugin];
	};

	return new FastifyServer({
		globalMiddlewares: [fastifyHelmet, fastifyCors],
		app: Fastify({ logger: IS_DEBUG }),

		port: +secrets.PORT,
		message,
		apis: [await v1()],
		logger: new Logger("FastifyServer"),
		IS_DEBUG,
	});
};
