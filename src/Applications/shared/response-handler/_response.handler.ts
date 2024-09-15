import type { HttpStatus } from "../../../Domain/core/http-status.enum.js";
import type { IResponse } from "../../../Domain/business/IResponse";
import type { ErrorType } from "../../../Domain/core/IErrorHandler";
import type { HttpResponse, IResponseHandler } from "../../../Domain/business/IResponseHandler";

// Errors
import { ZodError } from "zod";
import { DomainError } from "../../../Domain/core/errors.factory.js";

export class _ResponseHandler implements IResponseHandler {
	static #instance?: _ResponseHandler;
	static getInstance = (): _ResponseHandler => (this.#instance ??= new _ResponseHandler());

	readonly #status: Map<HttpStatus, string> = new Map();
	readonly #getStatusMessage = (code: HttpStatus): string => this.#status.get(code) ?? "Unknown Status";

	private constructor() {
		this.#status
			.set(200, "Success ok")
			.set(201, "Created")
			.set(400, "⚠ Bad Request ⚠️")
			.set(401, "🔒 Unauthorized 🔒")
			.set(402, "Payment Required 💳")
			.set(403, "🔒 Forbidden 🔒")
			.set(404, "Resourse Not Found")
			.set(409, "Conflict with the current state of the target resource")
			.set(422, "Unprocessable Content, fix request and try again")
			.set(451, "Unavailable For Legal Reasons")
			.set(500, "Internal Server Error")
			.set(503, "service unavailable ⏳ try later")
			.set(504, "Gateway Timeout ⌛");
	}

	// public readonly eventResponse: EventResponse;

	public readonly http: HttpResponse = ({ code, pagination, error, data }) => {
		if (error !== undefined) return this.#formatError(error);
		const status = { code: code ?? 200, message: this.#getStatusMessage(code ?? 200) };
		return { status, pagination, data };
	};

	readonly #formatError = <E>(error: ErrorType): IResponse<E> => {
		if (error instanceof ZodError) return this.#unprocessableContentErrors(error);
		if (error instanceof DomainError) return this.#domainErrors(error);
		return {
			status: { code: 500, message: this.#getStatusMessage(500) },
			error: "Ups!. Something went wrong, please try latter",
		};
	};

	readonly #unprocessableContentErrors = <E>({ issues }: ZodError): IResponse<E> => ({
		status: { code: 422, message: this.#getStatusMessage(422) },
		error: issues.map((issue) => ({ path: issue.path.join(": "), message: issue.message })),
	});

	readonly #domainErrors = <E>({ statusCode, name, message }: DomainError): IResponse<E> => ({
		status: { code: statusCode, message: this.#getStatusMessage(statusCode) },
		error: `${name}: ${message}`,
	});
}
