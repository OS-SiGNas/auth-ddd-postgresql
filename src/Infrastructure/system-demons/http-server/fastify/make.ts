import Fastify from "fastify";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";

import { DEBUG, secrets } from "#Config";
import { Logger } from "#common/logger-handler/make.js";
// v1
import { getAuthApp } from "#auth/v1/make.js";
import { getUsersApp } from "#users/v1/make.js";

import { FastifyServer } from "./fastify.server.js";

import type { FastifyPluginCallback } from "fastify";
import type { UsersRouterFastify } from "#users/v1/infrastructure/users-fastify.router";
import type { AuthRouterFastify } from "#auth/v1/infrastructure/auth-fastify.router";

export const getFastifyServer = async (): Promise<FastifyServer> => {
	const _v1 = async (): Promise<FastifyPluginCallback[]> => {
		const [auth, users] = await Promise.all([
			getAuthApp<AuthRouterFastify>(), // 0
			getUsersApp<UsersRouterFastify>(), // 1
		]);

		return [auth.plugin, users.plugin];
	};

	return new FastifyServer({
		globalMiddlewares: [fastifyHelmet, fastifyCors],
		app: Fastify({ logger: DEBUG }),
		port: +secrets.PORT,
		apis: [await _v1()],
		logger: new Logger("FastifyServer"),
		DEBUG,
	});
};
