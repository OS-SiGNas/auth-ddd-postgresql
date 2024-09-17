import { DomainError } from "../core/errors.factory.js";

export type ErrorType = DomainError | Error | unknown;

export interface IErrorHandler {
	catch: Catch;
}

export type Catch = ({ name, error, ticket }: Args) => void;
interface Args {
	name: string;
	error: ErrorType;
	ticket?: string;
}
