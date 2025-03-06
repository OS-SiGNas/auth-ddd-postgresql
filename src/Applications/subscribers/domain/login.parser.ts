import { z } from "zod";
import { Actions } from "#Domain/events/actions.enum.js";
import { actionParseStrategies } from "./action-parse-strategies.js";
import { UsersRequestDTO } from "#users/v1/domain/users-request.dto.js";

import type { Parser } from "#Domain/Business.js";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

const login: Parser<UserSessionDTO> = (o) => {
	const sessionModel = {
		accessToken: z.string(),
		refreshToken: z.string(),
	};

	const { uuid, name, email, rolesArr } = UsersRequestDTO.defaults;
	const userModel = {
		uuid,
		createdAt: z.date(),
		name,
		email,
		roles: rolesArr,
	};

	const session = z.object(sessionModel).strict();
	const user = z.object(userModel).strict();
	return z.object({ session, user }).strict().parse(o);
};

actionParseStrategies.set(Actions.LOGIN, login);
