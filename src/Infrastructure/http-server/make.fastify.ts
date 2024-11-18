import { IS_DEBUG, secrets } from "#Domain/config.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { UsersRouterFastify } from "#users/v1/infrastructure/users-fastify.router.js";
import type { AuthRouterFastify } from "#auth/v1/infrastructure/auth-fastify.router.js";

export const getFastifyServer = async (message: string) => {
	const [
		{ default: Fastify }, // 0
		{ FastifyServer }, // 1
	] = await Promise.all([
		import("fastify"), // 0
		import("./fastify.server.js"), // 1
	]);

	const v1 = async () => {
		const [{ getAuthRouter }, { getUsersRouter }] = await Promise.all([import("#auth/v1/make.js"), import("#users/v1/make.js")]);

		const [auth, users] = await Promise.all([
			getAuthRouter<AuthRouterFastify>(), // 0
			getUsersRouter<UsersRouterFastify>(), // 1
		]);

		return [...auth.getRoutes(), ...users.getRoutes()];
	};

	return new FastifyServer({
		app: Fastify({ logger: IS_DEBUG }),
		port: +secrets.PORT,
		message,
		apis: [await v1()],
		logger: new Logger("FastifyServer"),
		IS_DEBUG,
	});
};
