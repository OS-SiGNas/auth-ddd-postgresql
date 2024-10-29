import jwt from "jsonwebtoken";
// Global Domain
import { isDebug, SECRETS } from "../../Domain/System.js";
import { ModuleException } from "../../Domain/core/errors.factory.js";
// Application users
import { User } from "../users/domain/entities/users.entity.js";
// Applications shared
import { Logger } from "../shared/logger-handler/make.js";
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

export const getAuthRouter = async <T extends AuthRouterExpress | AuthRouterFastify>(): Promise<T> => {
	const HOR = 3600000;
	const MIN = 60000;

	const storage = new StorageHandler({
		cacheExpiredTime: isDebug ? 0.5 * HOR : 6 * HOR,
		keyExpiredTime: isDebug ? 5 * MIN : 10 * MIN,
		logger: new Logger("AuthBusinessStorage"),
		isDebug,
	});

	const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
		logger: new Logger("ActivateAccountTokenHandler"),
		jwtExpiredTime: SECRETS.JWT_AA_EXPIRED_TIME,
		jwtSecretKey: SECRETS.JWT_AA_SECRET_KEY,
		verify: jwt.verify,
		sign: jwt.sign,
		isDebug,
	});

	const business = new AuthBusiness({
		logger: new Logger("AuthBusiness"),
		activateAccountTokenHandler,
		repository: User,
		passwordHandler,
		storage,
		isDebug,
	});

	const controller = new AuthController({
		logger: new Logger("AuthController"),
		authRequestDTO: new AuthRequestDTO(),
		responseHandler,
		sessionHandler,
		errorHandler,
		business,
		isDebug,
	});

	if (SECRETS.HTTP_SERVICE === "express") {
		const { AuthRouterExpress } = await import("./infrastructure/auth-express.router.js");
		return new AuthRouterExpress({ controller }) as T;
	}

	if (SECRETS.HTTP_SERVICE === "fastify") {
		const { AuthRouterFastify } = await import("./infrastructure/auth-fastify.router.js");
		return new AuthRouterFastify({ controller }) as T;
	}

	throw new ModuleException("Auth module", 500);
};
