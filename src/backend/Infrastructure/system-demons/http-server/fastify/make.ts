import Fastify from "fastify";
import { fastifyHelmet } from "@fastify/helmet";
import { fastifyCors } from "@fastify/cors";

import { DEBUG, secrets } from "#Config";
import { eventFactory } from "#Domain";
import { bus } from "#Infrastructure/event-bus.js";

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
		const apps = await Promise.all([
			getAuthApp<AuthRouterFastify>(), // 0
			getUsersApp<UsersRouterFastify>(), // 1
		]);

		return apps.map((a) => a.plugin);
	};

	return new FastifyServer({
		globalMiddlewares: [fastifyHelmet, fastifyCors],
		logger: new Logger("FastifyServer"),
		app: Fastify({ logger: DEBUG }),
		port: +secrets.PORT,
		apis: [await _v1()],
		eventFactory,
		DEBUG,
		bus,
	});
};
