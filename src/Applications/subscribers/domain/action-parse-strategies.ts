import { z } from "zod";
import { Actions } from "#Domain/events/actions.enum.js";
import { ModuleException } from "#Domain/errors/error.factory.js";
import type { Parser } from "#Domain/Business";

export const actionParseStrategies = new (class {
	readonly #parsers: Map<Actions, Parser<unknown>> = new Map();
	constructor() {
		this.#parsers.set(Actions.REBOOT, (o: object) => {
			const schema = z.object({ a: z.string() });
			return schema.parse(o);
		});
	}

	public readonly set = <M>(a: Actions, parser: Parser<M>): this => {
		if (this.#parsers.has(a)) throw new ModuleException(`The parser for action ${a} is alredy exist`);
		this.#parsers.set(a, parser);
		return this;
	};

	public readonly parse = <M>(a: Actions, o: object): Readonly<M> => {
		const parser = this.#parsers.get(a);
		if (parser === undefined) throw new ModuleException(`${a} parser is undefined`);
		return parser(o) as M;
	};
})();

import("./login.parser.js");
