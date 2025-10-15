import jwt from "jsonwebtoken";

import { secrets, DEBUG } from "#Config";
import { bus, eventFactory, ModuleException } from "#Domain";
import { emailSender } from "#Infrastructure/proxy/email-proxy/make.js";

import { UserDTO } from "#users/v1/domain/users.dto.js";
// Common
import { passwordHandler } from "#common/password-handler/make.js";
import { responseHandler } from "#common/response-handler/make.js";
import { sessionHandler } from "#common/session-handler/make.js";
import { errorHandler } from "#common/error-handler/make.js";
import { StorageHandler } from "#common/storage.handler.js";
import { TokenHandler } from "#common/token.handler.js";
import { Logger } from "#common/logger-handler/make.js";
// local
import { AuthBusiness } from "./application/auth.business.js";
import { AuthRequestDTO } from "./application/auth-request.dto.js";
import { AuthController } from "./application/auth.controller.js";
import { AuthEmailSubscribers } from "./application/subscribers/email.notification.js";
import { modelRepository } from "#Infrastructure/model.respository.js";

import type { AuthRouterExpress } from "./infrastructure/auth-express.router.js";
import type { AuthRouterFastify } from "./infrastructure/auth-fastify.router.js";

export const authEmailSubscriber = new AuthEmailSubscribers({
	logger: new Logger("AuthEmailSubscriber"),
	url: secrets.THIS_URL,
	emailSender,
});

export const getAuthApp = async <T extends AuthRouterExpress | AuthRouterFastify>(): Promise<T> => {
	const HOR = 3600000;
	const MIN = 60000;

	const storage = new StorageHandler({
		cacheExpiredTime: DEBUG ? 0.5 * HOR : 6 * HOR,
		keyExpiredTime: DEBUG ? 5 * MIN : 10 * MIN,
		logger: new Logger("AuthBusinessStorage"),
		eventFactory,
		DEBUG,
		bus,
	});

	const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
		logger: new Logger("ActivateAccountTokenHandler"),
		jwtExpiredTime: secrets.JWT_AA_EXPIRED_TIME,
		jwtSecretKey: secrets.JWT_AA_SECRET_KEY,
		verify: jwt.verify,
		sign: jwt.sign,
	});

	const business = new AuthBusiness({
		logger: new Logger("AuthBusiness"),
		activateAccountTokenHandler,
		entityDTO: UserDTO,
		modelRepository,
		passwordHandler,
		eventFactory,
		storage,
		DEBUG,
		bus,
	});

	const controller = new AuthController({
		logger: new Logger("AuthController"),
		responseHandler,
		sessionHandler,
		eventFactory,
		errorHandler,
		business,
		DEBUG,
		bus,
	});

	const dto = new AuthRequestDTO();
	const dependencies = { dto, controller };

	if (secrets.HTTP_SERVICE === "express") {
		const { AuthRouterExpress } = await import("./infrastructure/auth-express.router.js");
		return new AuthRouterExpress(dependencies) as T;
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { AuthRouterFastify } = await import("./infrastructure/auth-fastify.router.js");
		return new AuthRouterFastify(dependencies) as T;
	}

	throw new ModuleException("Auth module");
};
