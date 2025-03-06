import type { DomainException, Ticket } from "./error.factory";

export interface IErrorHandler {
	catch: Catch;
}

export type Catch = (arg: { name: string; error: unknown; ticket: Ticket }) => DomainException;
