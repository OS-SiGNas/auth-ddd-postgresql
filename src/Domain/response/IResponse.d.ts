import type { DomainException } from "#Domain";
import type { HttpStatus } from "./http-status.enum";

export interface IResponse<R> {
	readonly status: Readonly<Status>;
	readonly pagination?: Readonly<Pagination>;
	readonly metadata?: Record<string, unknown>;
	readonly error?: unknown;
	readonly data?: R;
}

interface Status {
	code: HttpStatus;
	ticket?: DomainException["ticket"];
	message: string;
	success: boolean;
	timestamp: string;
	locale?: string;
}

interface Pagination {
	offset?: string;
	limit?: string;
	cursor?: string;
	next?: string;
	prev?: string;
	total?: string;
}
