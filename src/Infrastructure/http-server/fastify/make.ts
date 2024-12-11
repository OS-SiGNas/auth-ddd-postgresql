import Fastify from "fastify";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";

import { FastifyServer } from "./fastify.server.js";
import { IS_DEBUG, secrets } from "#Domain/config.js";
import { Logger } from "#shared/logger-handler/make.js";
// v1
import { getAuthApp } from "#auth/v1/make.js";
import { getUsersApp } from "#users/v1/make.js";

import type { UsersRouterFastify } from "#users/v1/infrastructure/users-fastify.router";
import type { AuthRouterFastify } from "#auth/v1/infrastructure/auth-fastify.router";
import type { FastifyPluginCallback } from "fastify";

export const getFastifyServer = async (message: string): Promise<FastifyServer> => {
	const _v1 = async (): Promise<FastifyPluginCallback[]> => {
		const [auth, users] = await Promise.all([
			getAuthApp<AuthRouterFastify>(), // 0
			getUsersApp<UsersRouterFastify>(), // 1
		]);

		return [auth.plugin, users.plugin];
	};

	return new FastifyServer({
		globalMiddlewares: [fastifyHelmet, fastifyCors],
		app: Fastify({ logger: IS_DEBUG }),
		port: +secrets.PORT,
		message,
		apis: [await _v1()],
		logger: new Logger("FastifyServer"),
		IS_DEBUG,
	});
};
