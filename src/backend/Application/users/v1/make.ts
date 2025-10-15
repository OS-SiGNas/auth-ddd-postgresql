import { DEBUG, secrets } from "#Config";
import { bus, eventFactory, ModuleException } from "#Domain";
import { modelRepository } from "#Infrastructure/model.respository.js";

import { passwordHandler } from "#common/password-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";
import { errorHandler } from "#common/error-handler/make.js";
import { responseHandler } from "#common/response-handler/make.js";
import { sessionHandler } from "#common/session-handler/make.js";

import { UsersBusiness } from "./application/users.business.js";
import { UsersRequestDTO } from "./application/users-request.dto.js";
import { UsersController } from "./application/users.controller.js";

import type { UsersRouterExpress } from "./infrastructure/users-express.router.js";
import type { UsersRouterFastify } from "./infrastructure/users-fastify.router.js";

export const getUsersApp = async <T extends UsersRouterExpress | UsersRouterFastify>(): Promise<T> => {
	let app: T | undefined;

	const business = new UsersBusiness({
		logger: new Logger("UsersBusiness"),
		modelRepository,
		passwordHandler,
		eventFactory,
		DEBUG,
		bus,
	});

	const controller = new UsersController({
		logger: new Logger("UsersController"),
		responseHandler,
		sessionHandler,
		errorHandler,
		eventFactory,
		business,
		DEBUG,
		bus,
	});

	const dto = new UsersRequestDTO();

	if (secrets.HTTP_SERVICE === "express") {
		const { UsersRouterExpress } = await import("./infrastructure/users-express.router.js");
		app = new UsersRouterExpress({ controller, dto }) as T;
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { UsersRouterFastify } = await import("./infrastructure/users-fastify.router.js");
		app = new UsersRouterFastify({ controller, dto }) as T;
	}

	if (app === undefined) throw new ModuleException("Users module is undefined");

	return await Promise.resolve(app);
};
