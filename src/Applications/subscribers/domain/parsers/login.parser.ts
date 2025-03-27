import { z } from "zod";
import { UsersRequestDTO } from "#users/v1/domain/users-request.dto.js";
import { UnprocessableException422 } from "#Domain/errors/error.factory.js";

import type { Parser } from "#Domain/Business.js";
import type { UserSessionDTO } from "#users/v1/domain/users.dto";

export const loginParser: Parser<UserSessionDTO> = (o) => {
	const { uuid, name, email, rolesArr } = UsersRequestDTO.defaults;
	const zDateFromString = z.string().transform((val) => {
		const date = new Date(val);
		if (isNaN(date.getTime())) throw new UnprocessableException422("(user -> createdAt) invalid date");
		return date;
	});

	const createdAt = typeof o.user.createdAt === "string" ? zDateFromString : z.date();

	const sessionModel = {
		accessToken: z.string(),
		refreshToken: z.string(),
	};

	const userModel = {
		uuid,
		createdAt,
		name,
		email,
		roles: rolesArr,
	};

	const session = z.object(sessionModel).strict();
	const user = z.object(userModel).strict();
	return z.object({ session, user }).strict().parse(o);
};
