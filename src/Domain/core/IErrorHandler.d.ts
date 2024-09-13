import { DomainError } from "../core/errors.factory.js";

export type ErrorType = DomainError | Error | unknown;

export interface IErrorHandler {
	catch: (name: string, error?: ErrorType) => void;
}
