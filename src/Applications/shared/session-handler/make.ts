import jwt from "jsonwebtoken";

import { ITokenPayload } from "#Domain/sessions/ISession.js";
import { secrets, DEBUG_MODE } from "#Config";
import { TokenHandler } from "../token.handler.js";
import { Logger } from "../logger-handler/make.js";
import { _SessionHandler } from "./_session.handler.js";

const { sign, verify } = jwt;

export const sessionHandler = _SessionHandler.getInstance({
	accessTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: secrets.JWT_ACCESS_SECRET_KEY,
		jwtExpiredTime: secrets.JWT_ACCESS_EXPIRED_TIME,
		logger: new Logger("AccessTokenHandler"),
		sign,
		verify,
		DEBUG_MODE,
	}),
	refreshTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: secrets.JWT_REFRESH_SECRET_KEY,
		jwtExpiredTime: secrets.JWT_REFRESH_EXPIRED_TIME,
		logger: new Logger("RefreshTokenHandler"),
		sign,
		verify,
		DEBUG_MODE,
	}),
});
