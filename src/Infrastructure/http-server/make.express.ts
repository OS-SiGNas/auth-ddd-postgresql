import { IS_DEBUG, secrets } from "#Domain/config.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { AuthRouterExpress } from "#auth/v1/infrastructure/auth-express.router.js";
import type { UsersRouterExpress } from "#users/v1/infrastructure/users-express.router.js";

export const getExpressServer = async (message: string) => {
	const [
		{ default: Express, Router }, // 0
		{ ExpressServer }, // 1
		{ globalMiddlewares, lastMiddlewares }, // 2
	] = await Promise.all([
		import("express"), // 0
		import("./express.server.js"), // 1
		import("./middlewares/make.js"), // 2
	]);

	const _router = Router();

	const _v1 = async () => {
		const [{ getAuthRouter }, { getUsersRouter }] = await Promise.all([
			import("#auth/v1/make.js"), // 0
			import("#users/v1/make.js"), // 1
		]);

		const [auth, users] = await Promise.all([
			getAuthRouter<AuthRouterExpress>(), // 0
			getUsersRouter<UsersRouterExpress>(), // 1
		]);

		return [auth.getRouter(_router), users.getRouter(_router)];
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
