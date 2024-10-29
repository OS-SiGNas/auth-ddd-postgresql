// Errors
import { DomainError } from "../../../Domain/core/errors.factory.js";
import { ZodError } from "zod";

import type { ILogger } from "../../../Domain/core/ILogger";
import type { Catch, IErrorHandler } from "../../../Domain/core/IErrorHandler";

interface Dependences {
	logger: ILogger;
}

export class _ErrorHandler implements IErrorHandler {
	static #instance?: _ErrorHandler;
	static getInstance = (d: Dependences): Readonly<_ErrorHandler> => (this.#instance ??= new _ErrorHandler(d));

	readonly #logger: ILogger;
	private constructor(d: Readonly<Dependences>) {
		this.#logger = d.logger;
	}

	public readonly catch: Catch = ({ error, name, ticket }) => {
		this.#logger.error(`${name}Error 💩 - ${ticket}`);
		if (error === undefined) return;
		if (!(error instanceof Error)) this.#logger.warn(`💀 Throw unknown 💀 typeof -> ${typeof error}`);

		if (error instanceof ZodError) {
			this.#errorZodHandler(error);
			return;
		}

		if (error instanceof DomainError) {
			error.ticket = ticket;
			this.#domainErrorHandler(error);
			return;
		}

		if (error instanceof Error) {
			this.#logger.error("💀 Unhandled Error 💀", error);
			return;
		}

		return;
	};

	readonly #errorZodHandler = ({ issues }: ZodError): void => {
		const errors = issues.map((issue) => ({ path: issue.path.join(": "), message: issue.message }));
		this.#logger.debug("Unprocesabble content: ", errors);
	};

	readonly #domainErrorHandler = ({ name, statusCode, message, ticket }: DomainError): void => {
		this.#logger.debug("Secure Handled", { name, message, statusCode, ticket });
	};
}
