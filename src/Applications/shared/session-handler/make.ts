import jwt from "jsonwebtoken";

import { ITokenPayload } from "../../../Domain/business/ISession.js";
import { secrets } from "../../../Domain/System.js";
import { TokenHandler } from "../token.handler.js";
import { Logger } from "../logger-handler/logger.js";
import { _SessionHandler } from "./_session.handler.js";
import { errorHandler } from "../error-handler/make.js";

const { sign, verify } = jwt;

export const sessionHandler = _SessionHandler.getInstance({
	errorHandler,
	accessTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: secrets.JWT_ACCESS_SECRET_KEY,
		jwtExpiredTime: secrets.JWT_ACCESS_EXPIRED_TIME,
		sign,
		verify,
		logger: new Logger("AccessTokenHandler"),
	}),
	refreshTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: secrets.JWT_REFRESH_SECRET_KEY,
		jwtExpiredTime: secrets.JWT_REFRESH_EXPIRED_TIME,
		sign,
		verify,
		logger: new Logger("RefreshTokenHandler"),
	}),
});