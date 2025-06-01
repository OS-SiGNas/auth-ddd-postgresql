import { getHttpMessage } from "#Domain";
import { _ResponseHandler } from "./_response.handler.js";

export const responseHandler = _ResponseHandler.getInstance({ getHttpMessage });
