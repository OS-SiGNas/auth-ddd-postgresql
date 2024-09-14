import { secrets } from "../../Domain/System.js";
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

const { HTTP_SERVICE } = secrets;
const business = new UsersBusiness({
	usersRepository: User,
	rolesRepository: Role,
	logger: new Logger("UsersBusiness"),
	passwordHandler,
});

const controller = new UsersController({
	business,
	errorHandler,
	logger: new Logger("UsersController"),
	responseHandler,
	sessionHandler,
	userRequestDTO: new UsersRequestDTO(),
});

export const usersExpress = await (async (): Promise<UsersRouterExpress | undefined> => {
	if (HTTP_SERVICE !== "express") return undefined;
	const { UsersRouterExpress } = await import("./infrastructure/users-express.router.js");
	return new UsersRouterExpress({ controller });
})();

export const usersFastify = await (async (): Promise<UsersRouterFastify | undefined> => {
	if (HTTP_SERVICE !== "fastify") return undefined;
	const { UsersRouterFastify } = await import("./infrastructure/users-fastify.router.js");
	return new UsersRouterFastify({ controller });
})();
