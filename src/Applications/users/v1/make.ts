import { DEBUG_MODE, secrets } from "#Config";
import { passwordHandler } from "#shared/password-handler/make.js";
import { Logger } from "#shared/logger-handler/make.js";
import { errorHandler } from "#shared/error-handler/make.js";
import { responseHandler } from "#shared/response-handler/make.js";
import { sessionHandler } from "#shared/session-handler/make.js";

import { UsersBusiness } from "./application/users.business.js";
import { UsersRequestDTO } from "./domain/users-request.dto.js";
import { UsersController } from "./infrastructure/users.controller.js";
import { User } from "./domain/entities/users.entity.js";
import { Role } from "./domain/entities/roles.entity.js";

import type { UsersRouterExpress } from "./infrastructure/users-express.router";
import type { UsersRouterFastify } from "./infrastructure/users-fastify.router";

// Error
import { ModuleException } from "#Domain/errors/error.factory.js";

export const getUsersApp = async <T extends UsersRouterExpress | UsersRouterFastify>(): Promise<T> => {
	const business = new UsersBusiness({
		logger: new Logger("UsersBusiness"),
		usersRepository: User,
		rolesRepository: Role,
		passwordHandler,
		DEBUG_MODE,
	});

	const controller = new UsersController({
		logger: new Logger("UsersController"),
		responseHandler,
		sessionHandler,
		errorHandler,
		business,
		DEBUG_MODE,
	});

	const dto = new UsersRequestDTO();

	if (secrets.HTTP_SERVICE === "express") {
		const { UsersRouterExpress } = await import("./infrastructure/users-express.router.js");
		return new UsersRouterExpress({ controller, dto }) as T;
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { UsersRouterFastify } = await import("./infrastructure/users-fastify.router.js");
		return new UsersRouterFastify({ controller, dto }) as T;
	}

	throw new ModuleException("Users module");
};
