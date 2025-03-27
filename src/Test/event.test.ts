/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe } from "node:test";
import { deepEqual, throws } from "node:assert";

import { Actions } from "#Domain/events/actions.enum.js";
import { DomainEvent, type IEvent } from "#Domain/events/domain-event.js";
import { UnprocessableException422 } from "#Domain/errors/error.factory.js";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.js";

describe("DomainEvent validations", () => {
	it("should throw UnprocessableException422 for invalid action", () => {
		const invalidEvent = {
			action: "INVALID_ACTION",
			id: "123e4567-e89b-12d3-a456-426614174000",
			createdAt: new Date(),
			emitter: "test-emitter",
			moduleEmitter: "test-module",
			correlationId: "123e4567-e89b-12d3-a456-426614174001",
			message: { data: "test-data" },
		};

		throws(() => DomainEvent.validate(invalidEvent as any), UnprocessableException422);
	});

	it("should throw UnprocessableException422 for invalid UUID", () => {
		const invalidEvent = {
			action: Actions.LOGIN,
			id: "invalid-uuid",
			createdAt: new Date(),
			emitter: "test-emitter",
			moduleEmitter: "test-module",
			correlationId: "123e4567-e89b-12d3-a456-426614174001",
			message: { data: "test-data" },
		};

		throws(() => DomainEvent.validate(invalidEvent as any), UnprocessableException422);
	});

	it("should throw UnprocessableException422 for missing required field", () => {
		const invalidEvent = {
			action: Actions.LOGIN,
			id: "123e4567-e89b-12d3-a456-426614174000",
			createdAt: new Date(),
			emitter: "test-emitter",
			correlationId: "123e4567-e89b-12d3-a456-426614174001",
			message: { data: "test-data" },
		};

		throws(() => DomainEvent.validate(invalidEvent as any), UnprocessableException422);
	});

	it("should validate a valid event", () => {
		const date = new Date();
		const validEvent: IEvent<UserSessionDTO> = {
			action: Actions.LOGIN,
			id: "123e4567-e89b-12d3-a456-426614174000",
			createdAt: date,
			emitter: "test-emitter",
			moduleEmitter: "test-module",
			correlationId: "123e4567-e89b-12d3-a456-426614174001",
			message: {
				session: {
					accessToken: "",
					refreshToken: "",
				},
				user: {
					uuid: "123e4567-e89b-12d3-a456-426614174000",
					name: "test",
					createdAt: date,
					email: "a@a.com",
					roles: [],
				},
			},
		};

		const validatedEvent = DomainEvent.validate<UserSessionDTO>(validEvent);
		deepEqual(validEvent, validatedEvent);
	});
});
