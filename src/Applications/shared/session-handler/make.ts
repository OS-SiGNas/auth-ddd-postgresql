import jwt from "jsonwebtoken";

import _TokenHandler from "./_token.handler.js";
import _SessionHandler from "./_session.handler.js";

import { secrets } from "../../../Domain/System.js";

import { errorHandler } from "../error-handler/make.js";
import { logger } from "../logger-handler/make.js";
import { ITokenHandler } from "../../../Domain/business/ITokenHandler.js";
import { ISessionHandler } from "../../../Domain/business/ISessionHandler.js";

export const tokenHandler: ITokenHandler = _TokenHandler.getInstance({
  jwtExpiredTime: secrets.JWT_EXPIRED_TIME,
  jwtSecretKey: secrets.JWT_SECRET_KEY,
  sign: jwt.sign,
  verify: jwt.verify,
  logger,
});

export const sessionHandler: ISessionHandler = _SessionHandler.getInstance({
  errorHandler,
  tokenHandler,
});
