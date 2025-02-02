import { z } from "zod";

import { Actions } from "#Domain/business/events/actions.enum.js";
import { DomainEvent, type IEvent } from "#Domain/business/events/domain-event.js";
import { UserSessionDTO } from "#users/v1/domain/users.dto.js";
import { UsersRequestDTO } from "#users/v1/domain/users-request.dto.js";

type Parser<T> = (o: IEvent<T>) => Promise<Readonly<IEvent<T>>>;

export const authDto = new (class {
	readonly [Actions.LOGIN]: Parser<UserSessionDTO> = async (e) => {
		const { defaults } = UsersRequestDTO;
		const eventSchema = {
			...DomainEvent.defaultsSchema,
			...DomainEvent.payloadSchema,
		};

		const event = await z
			.object(eventSchema)
			.strict()
			.parseAsync({ ...e, message: undefined });

		const session = { accessToken: defaults.token, refreshToken: defaults.token };
		const user = {
			uuid: defaults.uuid,
			name: defaults.name,
			email: defaults.email,
			createdAt: z.date(),
			roles: defaults.rolesArr,
		};

		const userParsed: UserSessionDTO["user"] = await z.object(user).strict().parseAsync(e.message.user);
		const sessionParsed: UserSessionDTO["session"] = await z.object(session).strict().parseAsync(e.message.session);

		return {
			...event,
			message: {
				user: userParsed,
				session: sessionParsed,
			},
		};
	};
})();
