import { randomUUID } from "node:crypto";
import { Logger } from "../../../Applications/shared/logger-handler/logger.js";

import type { RequestHandler } from "express";

const httpLogger = new Logger("RequestLogger");

export const requestLogger: RequestHandler = ({ headers, ip, method, url }, res, next) => {
	const uuid = randomUUID();
	headers.uuid = uuid;
	res.setHeader("X-REQ-UUID", uuid);
	const start = Date.now();
	res.on("finish", () => {
		const duration = Date.now() - start;
		httpLogger.info(`[ ${ip} ] (${method}) '${headers.uuid}' - ${url} - ${duration}ms`);
	});

	return next();
};
