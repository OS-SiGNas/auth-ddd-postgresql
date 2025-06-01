import type { IResponse, ISession } from "#Domain";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestParams {
	endpoint: string;
	method: Method;
	body?: object;
}

export type HttpProxyResponse<R> = Promise<IResponse<R>>;
export type Req1 = <R>(endpoint: string, signal: AbortSignal) => HttpProxyResponse<R>;
export type Req2 = <R>(endpoint: string, body: object, signal: AbortSignal) => HttpProxyResponse<R>;
export interface IHttpProxy {
	sendRequest: <R>(request: RequestParams, signal: AbortSignal) => HttpProxyResponse<R>;
	get: Req1;
	post: Req2;
	put: Req2;
	patch: Req2;
	del: Req1;
	/** Session setter */
	session?: ISession;
}
