import { HeadersEnum, BadRequestException400 } from "#Domain";
import { errorHandler } from "#common/error-handler/make.js";
import { responseHandler } from "#common/response-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";

import type { ErrorRequestHandler, Request } from "express";
import type { ILogger } from "#Domain";

export const errorsCatcher = (): ErrorRequestHandler => {
	const name = "ErrorCatcherMiddleware";
	const logger: ILogger = new Logger(name);

	return (error, req, res, next) => {
		const ticket = (res.getHeader(HeadersEnum.CORRELATION_ID) as string) ?? (req as Request).correlationId;

		logger.info(`Catched error in ${req.url} id: ${ticket}`);

		if (error instanceof TypeError) {
			const response = responseHandler.http<undefined>({ error: new BadRequestException400(error.message, { ticket }) });
			return res.status(response.status.code).json(response);
		}

		if (error instanceof SyntaxError) {
			const response = responseHandler.http<undefined>({ error: new BadRequestException400(error.message, { ticket }) });
			return res.status(response.status.code).json(response);
		}

		const response = responseHandler.http<undefined>({ error: errorHandler.catch({ name, ticket, error }) });
		res.status(response.status.code).json(response);
		return next();
	};
};
