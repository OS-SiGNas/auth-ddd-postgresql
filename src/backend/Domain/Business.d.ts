import type { Core } from "./Core";
import type { ModelRepository } from "#Infrastructure/model.respository";
import type { IErrorHandler } from "./errors/IErrorHandler";
import type { IResponseHandler } from "./response/IResponseHandler";
import type { ISessionHandler } from "./sessions/ISessionHandler";
import type { IResponse } from "./response/IResponse";

export interface BusinessDependencies extends Readonly<Core> {
	modelRepository: ModelRepository;
}

export interface ControllersDependencies extends Readonly<Core> {
	readonly sessionHandler: ISessionHandler;
	readonly responseHandler: IResponseHandler;
	readonly errorHandler: IErrorHandler;
}

export type Controller<Req, Res> = (request: Req) => Promise<Readonly<IResponse<Res>>>;
export type Business<P, R> = (payload: P) => Promise<R>;
export type Parser<P> = (o: object) => Readonly<P>;
export type AsyncParser<P> = (o: object) => Promise<Readonly<P>>;
