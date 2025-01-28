import type { ZodError } from "zod";
import type { HttpStatus } from "./http-status.enum";
import type { ErrorType } from "#Domain/core/IErrorHandler";
import type { IResponse, Pagination } from "./IResponse";

export interface IResponseHandler {
	http: HttpResponse;
}

export type HttpResponse = <R>(args: Args<R>) => IResponse<R>;
interface Args<R> {
	code?: HttpStatus;
	pagination?: Pagination;
	error?: ErrorType | ZodError;
	data?: R;
}
