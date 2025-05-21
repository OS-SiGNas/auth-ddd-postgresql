import { _ErrorHandler } from "./_error.handler.js";
import { Logger } from "../logger-handler/make.js";

export const errorHandler = _ErrorHandler.getInstance({
	logger: new Logger("ErrorHandler"),
});
