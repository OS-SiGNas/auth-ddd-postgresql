import { Router } from "express";
import jwt from "jsonwebtoken";
// Global Domain
import { ENVIRONMENT, secrets } from "../../Domain/System.js";
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
import { AuthRouter } from "./infrastructure/auth.router.js";

const storage = new StorageHandler({
	cacheExpiredTime: ENVIRONMENT === "production" ? 3600 * 1000 : 360 * 1000,
	keyExpiredTime: ENVIRONMENT === "production" ? 300 * 1000 : 120 * 1000,
	logger: new Logger("AuthBusinessStorage"),
});

const activateAccountTokenHandler = new TokenHandler<{ email: string }>({
	jwtSecretKey: secrets.JWT_AA_SECRET_KEY,
	jwtExpiredTime: secrets.JWT_AA_EXPIRED_TIME,
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

const authRouter = new AuthRouter({
	router: Router(),
	controller,
});

export const auth = authRouter.router;
