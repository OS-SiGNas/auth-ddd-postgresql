import type { Core } from "./core/Core";
import type { IErrorHandler } from "./errors/IErrorHandler";
import type { IResponseHandler } from "./response/IResponseHandler";
import type { ISessionHandler } from "./sessions/ISessionHandler";
import type { IResponse } from "./response/IResponse";

export interface ControllersDependences extends Readonly<Core> {
	readonly sessionHandler: ISessionHandler;
	readonly responseHandler: IResponseHandler;
	readonly errorHandler: IErrorHandler;
}

export type ControllerHandler<Req, Res> = (request: Req) => Promise<Readonly<IResponse<Res>>>;
export type BusinessHandler<P, R> = (payload: P) => Promise<R>;
export type Parser<P> = (o: object) => Readonly<P>;
export type AsyncParser<P> = (o: object) => Promise<Readonly<P>>;
