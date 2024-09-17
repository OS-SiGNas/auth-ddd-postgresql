import jwt from "jsonwebtoken";
// Global Domain
import { isDebug, secrets } from "../../Domain/System.js";
import { ModuleException } from "../../Domain/core/errors.factory.js";
// Application users
import { User } from "../users/domain/entities/users.entity.js";
// Applications shared
import { Logger } from "../shared/logger-handler/logger.js";
import { passwordHandler } from "../shared/password-handler/make.js";
import { sessionHandler } from "../shared/session-handler/make.js";
import { responseHandler } from "../shared/response-handler/make.js";
import { StorageHandler } from "../shared/storage.handler.js";
import { TokenHandler } from "../shared/token.handler.js";
import { errorHandler } from "../shared/error-handler/make.js";
// local
import { AuthBusiness } from "./applications/auth.business.js";
import { AuthRequestDTO } from "./domain/auth-request.dto.js";
import { AuthController } from "./infrastructure/auth.controller.js";

import type { AuthRouterExpress } from "./infrastructure/auth-express.router";
import type { AuthRouterFastify } from "./infrastructure/auth-fastify.router";

const { NODE_ENV, JWT_AA_EXPIRED_TIME, JWT_AA_SECRET_KEY } = secrets;

const storage = new StorageHandler({
	cacheExpiredTime: NODE_ENV === "production" ? 3600 * 1000 : 360 * 1000,
	keyExpiredTime: NODE_ENV === "production" ? 300 * 1000 : 120 * 1000,
	logger: new Logger("AuthBusinessStorage"),
	isDebug,
});

const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
	logger: new Logger("ActivateAccountTokenHandler"),
	isDebug,
	jwtSecretKey: JWT_AA_SECRET_KEY,
	jwtExpiredTime: JWT_AA_EXPIRED_TIME,
	sign: jwt.sign,
	verify: jwt.verify,
});

const business = new AuthBusiness({
	logger: new Logger("AuthBusiness"),
	isDebug,
	repository: User,
	passwordHandler,
	storage,
	activateAccountTokenHandler,
});

const controller = new AuthController({
	logger: new Logger("AuthController"),
	isDebug,
	errorHandler,
	business,
	sessionHandler,
	responseHandler,
	authRequestDTO: new AuthRequestDTO(),
});

export const getAuthRouter = async <T extends AuthRouterExpress | AuthRouterFastify>(): Promise<T> => {
	if (secrets.HTTP_SERVICE === "express") {
		const { AuthRouterExpress } = await import("./infrastructure/auth-express.router.js");
		return new AuthRouterExpress({ controller }) as T;
	}
	if (secrets.HTTP_SERVICE === "fastify") {
		const { AuthRouterFastify } = await import("./infrastructure/auth-fastify.router.js");
		return new AuthRouterFastify({ controller }) as T;
	}

	throw new ModuleException("Auth module", 500);
};
