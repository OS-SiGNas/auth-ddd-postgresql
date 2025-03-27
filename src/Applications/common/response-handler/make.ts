import { _ResponseHandler } from "./_response.handler.js";
import { getHttpMessage } from "#Domain/response/http-status.messages.js";

export const responseHandler = _ResponseHandler.getInstance({ getHttpMessage });
