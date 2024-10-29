import jwt from "jsonwebtoken";

import { ITokenPayload } from "../../../Domain/business/ISession.js";
import { SECRETS, isDebug } from "../../../Domain/System.js";
import { TokenHandler } from "../token.handler.js";
import { Logger } from "../logger-handler/make.js";
import { _SessionHandler } from "./_session.handler.js";

const { sign, verify } = jwt;

export const sessionHandler = _SessionHandler.getInstance({
	accessTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: SECRETS.JWT_ACCESS_SECRET_KEY,
		jwtExpiredTime: SECRETS.JWT_ACCESS_EXPIRED_TIME,
		logger: new Logger("AccessTokenHandler"),
		sign,
		verify,
		isDebug,
	}),
	refreshTokenHandler: new TokenHandler<ITokenPayload>({
		jwtSecretKey: SECRETS.JWT_REFRESH_SECRET_KEY,
		jwtExpiredTime: SECRETS.JWT_REFRESH_EXPIRED_TIME,
		logger: new Logger("RefreshTokenHandler"),
		sign,
		verify,
		isDebug,
	}),
});
