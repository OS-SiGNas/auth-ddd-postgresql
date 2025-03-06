import { Logger } from "#shared/logger-handler/make.js";
import { bgWhite } from "#shared/logger-handler/colors.utils.js";

import type { RequestHandler, Request } from "express";

export const requestLogger = ((): RequestHandler => {
	const _httpLogger = new Logger("RequestLogger");

	return (req, res, next) => {
		const { ip, method, url, correlationId } = req as Request;
		const start = Date.now();
		res.on("finish", () => {
			const duration = Date.now() - start;
			// _httpLogger.info(`[ ${ip} ] (${method}) '${correlationId}' - ${url} - ${res.statusCode} - ${duration}ms`);
			_httpLogger.info(`[${ip}]${bgWhite(`[ ${method} ]`)} '${correlationId}' - ${url} - ${res.statusCode} - ${duration}ms`);
		});

		return next();
	};
})();
