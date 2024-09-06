import { Router } from "express";

import { passwordHandler } from "../shared/password-handler/make.js";
import { responseHandler } from "../shared/response-handler/make.js";
import { sessionHandler, tokenHandler } from "../shared/session-handler/make.js";
import { StorageHandler } from "../shared/storage.handler.js";
import { logger } from "../shared/logger-handler/make.js";
import { errorHandler } from "../shared/error-handler/make.js";

import { AuthBusiness } from "./applications/auth.business.js";
import { AuthController } from "./infrastructure/auth.controller.js";
import { AuthRouter } from "./infrastructure/auth.router.js";
import { AuthRequestDTO } from "./domain/auth-request.dto.js";
import { User } from "../users/domain/entities/users.entity.js";

const storage = new StorageHandler({
  logger,
  cacheExpiredTime: 360000,
  keyExpiredTime: 180000,
});

const business = new AuthBusiness({
  repository: User,
  passwordHandler,
  sessionHandler,
  storage,
  tokenHandler,
});

const controller = new AuthController({
  name: "[auth-controller]",
  authRequestDTO: new AuthRequestDTO(),
  logger,
  business,
  errorHandler,
  responseHandler,
  sessionHandler,
});

const authRouter = new AuthRouter({
  router: Router(),
  controller,
});

export const auth = authRouter.router;
