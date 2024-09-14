import jwt from "jsonwebtoken";
// Global Domain
import { secrets } from "../../Domain/System.js";
// Application users
import { User } from "../users/domain/entities/users.entity.js";
// Applications shared
import { passwordHandler } from "../shared/password-handler/make.js";
import { sessionHandler } from "../shared/session-handler/make.js";
import { responseHandler } from "../shared/response-handler/make.js";
import { StorageHandler } from "../shared/storage.handler.js";
import { Logger } from "../shared/logger-handler/logger.js";
import { TokenHandler } from "../shared/token.handler.js";
import { errorHandler } from "../shared/error-handler/make.js";
// local
import { AuthBusiness } from "./applications/auth.business.js";
import { AuthRequestDTO } from "./domain/auth-request.dto.js";
import { AuthController } from "./infrastructure/auth.controller.js";

import type { AuthRouterExpress } from "./infrastructure/auth-express.router";
import type { AuthRouterFastify } from "./infrastructure/auth-fastify.router";

const { NODE_ENV, HTTP_SERVICE, JWT_AA_EXPIRED_TIME, JWT_AA_SECRET_KEY } = secrets;

const storage = new StorageHandler({
	cacheExpiredTime: NODE_ENV === "production" ? 3600 * 1000 : 360 * 1000,
	keyExpiredTime: NODE_ENV === "production" ? 300 * 1000 : 120 * 1000,
	logger: new Logger("AuthBusinessStorage"),
});

const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
	jwtSecretKey: JWT_AA_SECRET_KEY,
	jwtExpiredTime: JWT_AA_EXPIRED_TIME,
	sign: jwt.sign,
	verify: jwt.verify,
	logger: new Logger("ActivateAccountTokenHandler"),
});

const business = new AuthBusiness({
	repository: User,
	passwordHandler,
	storage,
	activateAccountTokenHandler,
	logger: new Logger("AuthBusiness"),
});

const controller = new AuthController({
	authRequestDTO: new AuthRequestDTO(),
	sessionHandler,
	responseHandler,
	errorHandler,
	business,
	logger: new Logger("AuthController"),
});

export const authExpress = await (async (): Promise<AuthRouterExpress | undefined> => {
	if (HTTP_SERVICE !== "express") return undefined;
	const { AuthRouterExpress } = await import("./infrastructure/auth-express.router.js");
	return new AuthRouterExpress({ controller });
})();

export const authFastify = await (async (): Promise<AuthRouterFastify | undefined> => {
	if (HTTP_SERVICE !== "fastify") return undefined;
	const { AuthRouterFastify } = await import("./infrastructure/auth-fastify.router.js");
	return new AuthRouterFastify({ controller });
})();
