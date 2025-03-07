import type { hash, compare, genSalt } from "bcryptjs";
import type { IPasswordHandler } from "#Domain/tools/IPasswordHandler";

interface Dependences {
	hash: typeof hash;
	compare: typeof compare;
	genSalt: typeof genSalt;
}

export class _PasswordHandler implements IPasswordHandler {
	static #instance?: _PasswordHandler;
	static readonly getInstance = (d: Dependences): Readonly<_PasswordHandler> => (this.#instance ??= new _PasswordHandler(d));

	readonly #hash: typeof hash;
	readonly #compare: typeof compare;
	readonly #genSalt: typeof genSalt;
	private constructor(d: Readonly<Dependences>) {
		this.#hash = d.hash;
		this.#compare = d.compare;
		this.#genSalt = d.genSalt;
	}

	public readonly encryptPassword = async (password: string): Promise<string> => {
		const salt = await this.#genSalt(10);
		return await this.#hash(password, salt);
	};

	public readonly comparePassword = async (password: string, receivedPassword: string): Promise<boolean> => {
		return await this.#compare(password, receivedPassword);
	};
}
