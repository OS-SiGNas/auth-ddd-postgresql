import { describe } from "node:test";
import assert from "node:assert";

import { cli } from "../make.js";

describe("should login user", async () => {
	const user = await cli.auth.login({
		query: {},
		params: {},
		correlationId: "",
		body: {
			email: "",
			password: "",
		},
	});

	assert.throws(() => {}, Error);
});
