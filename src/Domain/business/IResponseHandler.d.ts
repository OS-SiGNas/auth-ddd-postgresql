import type { ZodError } from "zod";
import type { HttpStatus } from "../core/http-status.enum.ts";
import type { ErrorType } from "../core/IErrorHandler";
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
