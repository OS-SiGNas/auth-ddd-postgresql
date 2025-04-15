import type { IResponse } from "./IResponse";

export interface IResponseHandler {
	http: HttpResponse;
}

export type HttpResponse = <Data>(args: {
	code?: IResponse<void>["status"]["code"];
	metadata?: IResponse<void>["metadata"];
	pagination?: IResponse<void>["pagination"];
	error?: IResponse<void>["error"];
	data?: Data;
}) => IResponse<Data>;
