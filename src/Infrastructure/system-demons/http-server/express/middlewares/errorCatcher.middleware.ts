import { BadRequestException400 } from "#Domain/errors/error.factory.js";
import { HeadersEnum } from "#Domain/response/headers.enum.js";
import { errorHandler } from "#common/error-handler/make.js";
import { responseHandler } from "#common/response-handler/make.js";
import { Logger } from "#common/logger-handler/make.js";

import type { ErrorRequestHandler, Request } from "express";
import type { Catch } from "#Domain/errors/IErrorHandler";
import type { HttpResponse } from "#Domain/response/IResponseHandler";
import type { ILogger } from "#Domain/core/ILogger";

export const { errorsCatcher } = new (class {
	readonly #name = "ErrorCatcherMiddleware";
	readonly #logger: ILogger = new Logger(this.#name);
	readonly #response: HttpResponse = responseHandler.http;
	readonly #catch: Catch = errorHandler.catch;

	public readonly errorsCatcher: ErrorRequestHandler = (error, req, res, next) => {
		const ticket = (res.getHeader(HeadersEnum.CORRELATION_ID) as string) ?? (req as Request).correlationId;

		this.#logger.info(`Catched error in ${req.url} id: ${ticket}`);

		if (error instanceof SyntaxError) {
			const response = this.#response<never>({ error: new BadRequestException400(error.message, { ticket }) });
			return res.status(response.status.code).json(response);
		}

		const response = this.#response<never>({
			error: this.#catch({ name: this.#name, ticket, error }),
		});

		res.status(response.status.code).json(response);
		return next();
	};
})();
