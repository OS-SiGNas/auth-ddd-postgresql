import { ZodError } from "zod";
import { DEBUG } from "#Config";
import { DomainException, InternalServerException500 } from "#Domain";

import type { GetHttpMessage, HttpResponse, HttpStatus, IResponse, IResponseHandler } from "#Domain";

interface Dependencies {
	getHttpMessage: GetHttpMessage;
}

export class _ResponseHandler implements IResponseHandler {
	static #instance?: _ResponseHandler;
	static getInstance = (d: Dependencies): _ResponseHandler => (this.#instance ??= new _ResponseHandler(d));

	readonly #getHttpMessage: GetHttpMessage;
	private constructor(d: Dependencies) {
		this.#getHttpMessage = d.getHttpMessage;
	}

	/**
	 * Responses implements
	 * In case of scaling, create a strategy pattern

	public readonly socket: SocketResponse
	public readonly event: EventResponse */
	public readonly http: HttpResponse = ({ code, metadata, pagination, error, data }) => {
		if (error !== undefined) return this.#formatError(error);
		const status = this.#getStatus(code ?? 200);
		return { status, metadata, pagination, data };
	};

	readonly #formatError = (error: unknown): IResponse<never> => {
		if (error instanceof DomainException) return this.#domainErrors(error);
		if (error instanceof ZodError) return this.#unprocessableContentErrors(error);
		return this.#unhandledError();
	};

	readonly #domainErrors = ({ code, name, message, cause, stack, ticket }: DomainException): IResponse<never> => {
		if (code >= 500) return this.#unhandledError();
		return {
			status: this.#getStatus(code, ticket),
			error: { name, message, cause, stack: this.#getStack(stack) },
		};
	};

	readonly #unprocessableContentErrors = ({ issues }: ZodError): IResponse<never> => ({
		status: this.#getStatus(422),
		error: {
			name: "UnprocessableContentError",
			message: "Unprocessable entity, check cause",
			cause: issues.map(({ path, message }) => ({ path: path.join(": "), message })),
		},
	});

	readonly #unhandledError = (): IResponse<never> => {
		const message = "Ups!. Something went wrong, please try latter";
		const cause = DEBUG ? "Unhandled error response" : undefined;
		const { code, name, stack, ticket } = new InternalServerException500(message, { cause });
		return {
			status: this.#getStatus(code, ticket),
			error: { name, message, cause, stack: this.#getStack(stack) },
		};
	};

	readonly #getStatus = (code: HttpStatus, ticket?: string): IResponse<void>["status"] => ({
		success: code < 400,
		code,
		ticket,
		timestamp: Date.now().toString(),
		message: this.#getHttpMessage(code),
	});

	readonly #getStack = (stack?: string): string[] | undefined => {
		if (stack === undefined) return;
		if (!DEBUG) return;
		else return stack.split("\n");
	};
}
