import type { IResponse } from "./IResponse";

export interface IResponseHandler {
	http: HttpResponse;
}

export type HttpResponse = <Data>(args: {
	code?: IResponse<never>["status"]["code"];
	metadata?: IResponse<never>["metadata"];
	pagination?: IResponse<never>["pagination"];
	error?: IResponse<never>["error"];
	data?: Data;
}) => IResponse<Data>;
