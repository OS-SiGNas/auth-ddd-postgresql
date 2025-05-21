import { ACTIONS, ModuleException } from "#Domain";
import { loginParser } from "./parsers/login.parser.js";
import { accountActivatedParser } from "./parsers/account-activated.parser.js";

import type { Parser } from "#Domain";

interface ParseStrategies {
	parse: <M>(a: ACTIONS, o: M) => Readonly<M>;
}

export const actionParseStrategies: ParseStrategies = new (class {
	readonly #parsers: Map<ACTIONS, Parser<unknown>>;
	constructor() {
		this.#parsers = new Map()
			// .set(Actions.REBOOT, rebootParser);
			.set(ACTIONS.LOGIN, loginParser)
			.set(ACTIONS.ACCOUNT_ACTIVATED, accountActivatedParser);
		// .set(Actions.NEW_ACCOUNT_REGISTERED, newAccountRegisteredParser)
	}

	public readonly parse = <M>(a: ACTIONS, o: M): Readonly<M> => {
		const parser = this.#parsers.get(a);
		if (parser === undefined) throw new ModuleException(`${a} parser is undefined`);
		return parser(o) as M;
	};
})();
