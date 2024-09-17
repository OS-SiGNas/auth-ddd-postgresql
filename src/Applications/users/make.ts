import { secrets, isDebug } from "../../Domain/System.js";
import { passwordHandler } from "../shared/password-handler/make.js";
import { Logger } from "../shared/logger-handler/logger.js";
import { errorHandler } from "../shared/error-handler/make.js";
import { responseHandler } from "../shared/response-handler/make.js";
import { sessionHandler } from "../shared/session-handler/make.js";

import { UsersBusiness } from "./application/users.business.js";
import { UsersRequestDTO } from "./domain/users-request.dto.js";
import { UsersController } from "./infrastructure/users.controller.js";
import { User } from "./domain/entities/users.entity.js";
import { Role } from "./domain/entities/roles.entity.js";

import type { UsersRouterExpress } from "./infrastructure/users-express.router";
import type { UsersRouterFastify } from "./infrastructure/users-fastify.router";

// Error
import { ModuleException } from "../../Domain/core/errors.factory.js";

const business = new UsersBusiness({
	logger: new Logger("UsersBusiness"),
	usersRepository: User,
	rolesRepository: Role,
	isDebug,
	passwordHandler,
});

const controller = new UsersController({
	logger: new Logger("UsersController"),
	userRequestDTO: new UsersRequestDTO(),
	isDebug,
	business,
	errorHandler,
	responseHandler,
	sessionHandler,
});

export const getUsersRouter = async <T extends UsersRouterExpress | UsersRouterFastify>(): Promise<T> => {
	if (secrets.HTTP_SERVICE === "express") {
		const { UsersRouterExpress } = await import("./infrastructure/users-express.router.js");
		return new UsersRouterExpress({ controller }) as T;
	}
	if (secrets.HTTP_SERVICE === "fastify") {
		const { UsersRouterFastify } = await import("./infrastructure/users-fastify.router.js");
		return new UsersRouterFastify({ controller }) as T;
	}

	throw new ModuleException("Users module", 500);
};
