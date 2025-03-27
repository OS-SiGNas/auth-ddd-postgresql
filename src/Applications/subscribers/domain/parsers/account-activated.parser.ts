import { z } from "zod";
import { UnprocessableException422 } from "#Domain/errors/error.factory.js";
import { UsersRequestDTO } from "#users/v1/domain/users-request.dto.js";

import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { Parser } from "#Domain/Business";

export const accountActivatedParser: Parser<UserNonSensitiveData> = (o) => {
	const { uuid, name, email, rolesArr } = UsersRequestDTO.defaults;

	const zDateFromString = z.string().transform((val) => {
		const date = new Date(val);
		if (isNaN(date.getTime())) throw new UnprocessableException422("(user -> createdAt) invalid date");
		return date;
	});

	const createdAt = typeof o.createdAt === "string" ? zDateFromString : z.date();

	const schema = {
		uuid,
		createdAt,
		email,
		name,
		roles: rolesArr,
	};

	return z.object(schema).strict().parse(o);
};
