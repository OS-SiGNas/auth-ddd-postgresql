import { ZodError } from "zod";
import { DomainException, GatewayTimeoutException504, InternalServerException500, UnprocessableException422 } from "#Domain";

import type { ILogger, Ticket, Catch, IErrorHandler } from "#Domain";

interface Dependencies {
	logger: ILogger;
}

export class _ErrorHandler implements IErrorHandler {
	static #instance?: _ErrorHandler;
	static getInstance = (d: Dependencies): Readonly<_ErrorHandler> => (this.#instance ??= new _ErrorHandler(d));

	readonly #logger: ILogger;
	constructor(d: Dependencies) {
		this.#logger = d.logger;
	}

	public readonly catch: Catch = ({ name, error, ticket }): DomainException => {
		this.#logger.debug(`💩 ${name}Error - ${ticket}`);
		if (error === undefined) return this.#getInternalServerException(ticket);
		if (!(error instanceof Error)) return this.#unknownThrow(error, ticket);
		if (error instanceof DomainException) return this.#domainExceptionHandler(error, ticket);
		if (error instanceof ZodError) return this.#zodErrorHandler(error, ticket);
		if (error instanceof Error) return this.#errorHandler(error, ticket);
		return this.#getInternalServerException(ticket);
	};

	readonly #getInternalServerException = (ticket: Ticket): DomainException =>
		new InternalServerException500("Something wrong, please try again latter", { ticket });

	readonly #unknownThrow = (error: unknown, ticket: Ticket): DomainException => {
		this.#logger.warn(`💀 Throw unknown 💀 typeof -> ${typeof error}`);
		this.#logger.debug(String(error));
		return this.#getInternalServerException(ticket);
	};

	readonly #domainExceptionHandler = (exception: DomainException, ticket: Ticket): DomainException => {
		exception.ticket = ticket;
		this.#logger.debug(`Secure Handled ${exception.name} ${exception.message}.`);
		return exception;
	};

	readonly #zodErrorHandler = ({ issues }: ZodError, ticket: Ticket): DomainException => {
		const cause = issues.map(({ path, message }) => ({ path: `(${path.join(": ")})`, message }));
		this.#logger.debug("Unprocesabble content: ", cause);
		return new UnprocessableException422("Fix request and try again", { ticket, cause });
	};

	readonly #errorHandler = (error: Error, ticket: Ticket): DomainException => {
		if (error.message.includes("DataSource is not set for this entit")) return new GatewayTimeoutException504("External resource unavailable", { ticket });

		this.#logger.warn(`💀 Unhandled Error ${error.name} 💀 - ${ticket}`, error);
		return this.#getInternalServerException(ticket);
	};
}
