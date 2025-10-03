import type { DomainException, Ticket } from "./error.factory";

type Try = <R>(p: Promise<R>) => Promise<[Error] | [null, R]>;
type Catch = (arg: { name: string; error: unknown; ticket: Ticket }) => DomainException;

export interface IErrorHandler {
	try: Try;
	catch: Catch;
}
