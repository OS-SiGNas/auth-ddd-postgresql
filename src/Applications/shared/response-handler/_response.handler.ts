import { ZodError } from "zod";
import { DEBUG_MODE } from "#Config";
import { DomainException, InternalServerException500 } from "#Domain/errors/error.factory.js";

import type { HttpStatus } from "#Domain/response/http-status.enum";
import type { IResponse } from "#Domain/response/IResponse";
import type { IResponseHandler, HttpResponse } from "#Domain/response/IResponseHandler";

export class _ResponseHandler implements IResponseHandler {
	static #instance?: _ResponseHandler;
	static getInstance = (): _ResponseHandler => (this.#instance ??= new _ResponseHandler());

	readonly #getStatusMessage = (code: HttpStatus): string => this.#status.get(code) ?? "Unknown Status";
	readonly #status: Map<HttpStatus, string> = new Map()
		.set(200, "Success ok")
		.set(201, "Created")
		.set(400, "⚠ Bad request ⚠️")
		.set(401, "🔒 Unauthorized 🔒")
		.set(402, "Payment required 💳")
		.set(403, "🔒 Forbidden 🔒")
		.set(404, "Resourse not found")
		.set(409, "Conflict with the current state of the target resource")
		.set(422, "Unprocessable content, fix request and try again")
		.set(451, "Unavailable for legal reasons")
		.set(500, "Internal server error")
		.set(503, "service unavailable ⏳ try later")
		.set(504, "Gateway timeout ⌛");

	/**  Responses implements
	publci readonly socket: SocketResponse
	public readonly event: EventResponse */
	public readonly http: HttpResponse = ({ code, metadata, pagination, error, data }) => {
		if (error !== undefined) return this.#formatError(error);
		const status = this.#getStatus(code ?? 200);
		return { status, metadata, pagination, data };
	};
	readonly #formatError = <E>(error: unknown): IResponse<E> => {
		if (error instanceof DomainException) return this.#domainErrors(error);
		if (error instanceof ZodError) return this.#unprocessableContentErrors(error);
		return this.#unhandledError();
	};

	readonly #domainErrors = <E>({ code, name, message, cause, stack, ticket }: DomainException): IResponse<E> => ({
		status: this.#getStatus(code, ticket),
		error: { name, message, cause, stack: this.#getStack(stack) },
	});

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
		const cause = "Unhandled error response";
		const { code, name, stack, ticket } = new InternalServerException500(message, { cause });
		return {
			status: this.#getStatus(code, ticket),
			error: { name, message, cause: DEBUG_MODE ? cause : undefined, stack: this.#getStack(stack) },
		};
	};

	readonly #getStatus = (code: HttpStatus, ticket?: string): IResponse<never>["status"] => ({
		code,
		ticket,
		message: this.#getStatusMessage(code),
		success: code < 400,
		timestamp: Date.now().toString(),
	});

	readonly #getStack = (stack?: string): string[] | undefined => {
		if (stack === undefined) return;
		if (!DEBUG_MODE) return;
		else return stack.split("\n");
	};
}
