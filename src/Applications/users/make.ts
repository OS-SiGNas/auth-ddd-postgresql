import { Router } from "express";

import { passwordHandler } from "../shared/password-handler/make.js";
import { Logger } from "../shared/logger-handler/logger.js";
import { errorHandler } from "../shared/error-handler/make.js";
import { responseHandler } from "../shared/response-handler/make.js";
import { sessionHandler } from "../shared/session-handler/make.js";

import { UsersBusiness } from "./application/users.business.js";
import { UsersRequestDTO } from "./domain/users-request.dto.js";
import { UsersController } from "./infrastructure/users.controller.js";
import { UsersRouter } from "./infrastructure/users.router.js";
import { User } from "./domain/entities/users.entity.js";
import { Role } from "./domain/entities/roles.entity.js";

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

const userRouter = new UsersRouter({
	router: Router(),
	controller,
});

export const users = userRouter.router;
