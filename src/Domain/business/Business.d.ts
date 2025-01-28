import type { Request } from "express";
import type { FastifyRequest } from "fastify";
import type { IResponseHandler } from "./http/IResponseHandler";
import type { Core } from "#Domain/core/Core";
import type { IResponse } from "./http/IResponse";
import type { ISessionHandler } from "./sessions/ISessionHandler";
import type { IErrorHandler } from "#Domain/core/IErrorHandler";

export interface ControllersDependences extends Core {
	readonly sessionHandler: ISessionHandler;
	readonly responseHandler: IResponseHandler;
	readonly errorHandler: IErrorHandler;
}

export type ControllerHandler<Res> = (request: Request | FastifyRequest) => Promise<IResponse<Res>>;
export type BusinessHandler<P, R> = (payload: P) => Promise<R>;

export type Parser<P> = (target: P) => Promise<Readonly<P>>;
