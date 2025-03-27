import { Actions } from "#Domain/events/actions.enum.js";
import { ModuleException } from "#Domain/errors/error.factory.js";
import { loginParser } from "./parsers/login.parser.js";
import { accountActivatedParser } from "./parsers/account-activated.parser.js";

import type { Parser } from "#Domain/Business";

interface ParseStrategies {
	parse: <M>(a: Actions, o: M) => Readonly<M>;
}

export const actionParseStrategies: ParseStrategies = new (class {
	readonly #parsers: Map<Actions, Parser<unknown>>;
	constructor() {
		this.#parsers = new Map()
			// .set(Actions.REBOOT, rebootParser);
			.set(Actions.LOGIN, loginParser)
			.set(Actions.ACCOUNT_ACTIVATED, accountActivatedParser);
		// .set(Actions.NEW_ACCOUNT_REGISTERED, newAccountRegisteredParser)
	}

	public readonly parse = <M>(a: Actions, o: M): Readonly<M> => {
		const parser = this.#parsers.get(a);
		if (parser === undefined) throw new ModuleException(`${a} parser is undefined`);
		return parser(o) as M;
	};
})();
