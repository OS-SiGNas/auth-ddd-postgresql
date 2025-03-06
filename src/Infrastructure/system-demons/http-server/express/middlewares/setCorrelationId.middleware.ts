import { randomUUID } from "node:crypto";
import { HeadersEnum } from "#Domain/response/headers.enum.js";
import { Logger } from "#shared/logger-handler/make.js";

import type { Request, RequestHandler } from "express";

declare module "express" {
	interface Request {
		correlationId: string;
	}
}

export const setCorrelationId: RequestHandler = (() => {
	const _logger = new Logger("SetCorrelationId-Middleware");
	const _getUUID = (): string => {
		const uuid = randomUUID();
		_logger.debug("New correlation id generated: " + uuid);
		return uuid;
	};

	return (req, res, next) => {
		const headerName = HeadersEnum.CORRELATION_ID;
		const correlationId = req.header(headerName) ?? _getUUID();
		(req as Request).correlationId = correlationId;
		res.setHeader(headerName, correlationId);
		return next();
	};
})();
