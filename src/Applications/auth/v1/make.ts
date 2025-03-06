import jwt from "jsonwebtoken";
// Global Domain
import { secrets, DEBUG_MODE } from "#Config";
import { ModuleException } from "#Domain/errors/error.factory.js";
// Application users
import { User } from "#users/v1/domain/entities/users.entity.js";
// Applications shared
import { Logger } from "#shared/logger-handler/make.js";
import { passwordHandler } from "#shared/password-handler/make.js";
import { sessionHandler } from "#shared/session-handler/make.js";
import { responseHandler } from "#shared/response-handler/make.js";
import { StorageHandler } from "#shared/storage.handler.js";
import { TokenHandler } from "#shared/token.handler.js";
import { errorHandler } from "#shared/error-handler/make.js";
// local
import { AuthBusiness } from "./applications/auth.business.js";
import { AuthRequestDTO } from "./domain/auth-request.dto.js";
import { AuthController } from "./infrastructure/auth.controller.js";

import type { AuthRouterExpress } from "./infrastructure/auth-express.router";
import type { AuthRouterFastify } from "./infrastructure/auth-fastify.router";

export const getAuthApp = async <T extends AuthRouterExpress | AuthRouterFastify>(): Promise<T> => {
	const HOR = 3600000;
	const MIN = 60000;

	const storage = new StorageHandler({
		cacheExpiredTime: DEBUG_MODE ? 0.5 * HOR : 6 * HOR,
		keyExpiredTime: DEBUG_MODE ? 5 * MIN : 10 * MIN,
		logger: new Logger("AuthBusinessStorage"),
		DEBUG_MODE,
	});

	const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
		logger: new Logger("ActivateAccountTokenHandler"),
		jwtExpiredTime: secrets.JWT_AA_EXPIRED_TIME,
		jwtSecretKey: secrets.JWT_AA_SECRET_KEY,
		verify: jwt.verify,
		sign: jwt.sign,
		DEBUG_MODE,
	});

	const business = new AuthBusiness({
		logger: new Logger("AuthBusiness"),
		activateAccountTokenHandler,
		repository: User,
		passwordHandler,
		storage,
		DEBUG_MODE,
	});

	const controller = new AuthController({
		logger: new Logger("AuthController"),
		responseHandler,
		sessionHandler,
		errorHandler,
		business,
		DEBUG_MODE,
	});

	const dto = new AuthRequestDTO();

	if (secrets.HTTP_SERVICE === "express") {
		const { AuthRouterExpress } = await import("./infrastructure/auth-express.router.js");
		return new AuthRouterExpress({ controller, dto }) as T;
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { AuthRouterFastify } = await import("./infrastructure/auth-fastify.router.js");
		return new AuthRouterFastify({ controller, dto }) as T;
	}

	throw new ModuleException("Auth module");
};
