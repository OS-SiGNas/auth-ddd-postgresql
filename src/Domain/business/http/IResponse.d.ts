import type { ErrorType } from "#Domain/core/IErrorHandler";
import type { HttpStatus } from "./http-status.enum";

export interface IResponse<R> {
	readonly status: Status;
	readonly pagination?: Pagination;
	readonly data?: R;
	readonly error?: ErrorType;
}

export interface Status {
	readonly code: HttpStatus;
	readonly ticket?: string;
	readonly message: string;
}

export interface Pagination {
	readonly offset?: string;
	readonly limit?: string;
	readonly cursor?: string;
	readonly next?: string;
	readonly prev?: string;
	readonly total?: string;
}
