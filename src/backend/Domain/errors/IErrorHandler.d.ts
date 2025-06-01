import type { DomainException, Ticket } from "./error.factory";

type genericFn = (...args: any[]) => Promise<any>;
type Try = <F extends genericFn>(fn: F, ...args: Parameters<F>) => Promise<[null | Error, Awaited<ReturnType<F>>]>;
type Catch = (arg: { name: string; error: unknown; ticket: Ticket }) => DomainException;

export interface IErrorHandler {
	try: Try;
	catch: Catch;
}
