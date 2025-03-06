// /* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe } from "node:test";
import { throws } from "node:assert";

import { actionParseStrategies } from "../domain/action-parse-strategies.js";
import { Actions } from "#Domain/events/actions.enum.js";
import { ModuleException } from "#Domain/errors/error.factory.js";

import type { Parser } from "#Domain/Business.js";

describe("Action parse strategies test", () => {
	it("should make it impossible to include two or more parsers of the same action", () => {
		const invalidParser: Parser<{ a: string }> = (o) => {
			console.log(o);
			return { a: "" };
		};

		const invalidParser2: Parser<{ a: string }> = (o) => {
			console.log(o);
			return { a: "" };
		};

		throws(() => {
			actionParseStrategies.set(Actions.LOGIN, invalidParser);
			actionParseStrategies.set(Actions.LOGIN, invalidParser2);
		}, ModuleException);
	});
});
