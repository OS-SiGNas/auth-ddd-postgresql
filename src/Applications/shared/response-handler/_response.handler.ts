import type { HttpStatus } from "../../../Domain/core/http-status.enum.js";
import type { IResponse } from "../../../Domain/business/IResponse";
import type { ErrorType } from "../../../Domain/core/IErrorHandler";
import type { IResponseHandler, ResponseBusiness } from "../../../Domain/business/IResponseHandler";

// Errors
import { ZodError } from "zod";
import { DomainError } from "../../../Domain/core/errors.factory.js";

export default class _ResponseHandler implements IResponseHandler {
  static #instance?: _ResponseHandler;
  static getInstance = (): _ResponseHandler => (this.#instance ??= new _ResponseHandler());

  readonly #status: Map<HttpStatus, string> = new Map();
  private constructor() {
    this.#status.set(200, "Success ok");
    this.#status.set(201, "Created");
    this.#status.set(400, "⚠ Bad Request ⚠️");
    this.#status.set(401, "🔒 Unauthorized 🔒");
    this.#status.set(402, "Payment Required 💳");
    this.#status.set(403, "🔒 Forbidden 🔒");
    this.#status.set(404, "Resourse Not Found");
    this.#status.set(422, "Unprocessable Content, fix request and try again");
    this.#status.set(451, "Unavailable For Legal Reasons");
    this.#status.set(500, "Internal Server Error");
    this.#status.set(503, "service unavailable ⏳ try later");
    this.#status.set(504, "Gateway Timeout ⌛");
  }
  readonly #getStatusMessage = (code: HttpStatus): string => this.#status.get(code) ?? "Unknown Status";

  public readonly businessResponse: ResponseBusiness = ({ code, pagination, error, data }) => {
    if (error !== undefined) return this.#formatError(error);
    const status = { code: code ?? 200, message: this.#getStatusMessage(code ?? 200) };
    return { status, pagination, data };
  };

  readonly #formatError = <E>(error: ErrorType): IResponse<E> => {
    if (error instanceof ZodError) return this.#unprocessableContent(error);
    if (error instanceof DomainError) return this.#errorBusiness(error);
    else return { status: { code: 500, message: `1: Unhandled Error, 2: ${this.#getStatusMessage(500)}` } };
  };

  readonly #unprocessableContent = <E>({ issues }: ZodError): IResponse<E> => ({
    status: { code: 422, message: this.#getStatusMessage(422) },
    error: issues.map((issue) => ({ path: issue.path.join(": "), message: issue.message })),
  });

  readonly #errorBusiness = <E>({ ticket, statusCode, name, message, issues }: DomainError): IResponse<E> => ({
    status: { code: statusCode, ticket, message: this.#getStatusMessage(statusCode) },
    error: { name, message, issues },
  });
}
