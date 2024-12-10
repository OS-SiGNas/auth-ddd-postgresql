import jwt from "jsonwebtoken";

import { ITokenPayload } from "#Domain/business/ISession.js";
import { secrets, IS_DEBUG } from "#Domain/config.js";
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
		IS_DEBUG,
	}),
	refreshTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: secrets.JWT_REFRESH_SECRET_KEY,
		jwtExpiredTime: secrets.JWT_REFRESH_EXPIRED_TIME,
		logger: new Logger("RefreshTokenHandler"),
		sign,
		verify,
		IS_DEBUG,
	}),
});
