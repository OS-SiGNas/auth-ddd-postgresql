import { randomUUID } from "node:crypto";
import { Logger } from "../../../Applications/shared/logger-handler/make.js";

import type { RequestHandler } from "express";

const httpLogger = new Logger("RequestLogger");

export const requestLogger: RequestHandler = ({ headers, ip, method, url }, res, next) => {
	const uuid = randomUUID();
	headers.uuid = uuid;
	res.setHeader("X-Request-ID", uuid);
	const start = Date.now();
	res.on("finish", () => {
		const duration = Date.now() - start;
		httpLogger.info(`[ ${ip} ] (${method}) '${uuid}' - ${url} - ${res.statusCode} - ${duration}ms`);
	});

	return next();
};
