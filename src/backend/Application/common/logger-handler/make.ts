import { secrets } from "#Config";
import type { LoggerConstructor } from "#Domain";

/**
 * @description Logger
 * @description make file return  Logger class constructor */
export const Logger: LoggerConstructor = await (async (): Promise<LoggerConstructor> => {
	const _service = secrets.LOGGER_SERVICE;

	if (_service === "logan") {
		const [{ _GetLogan }, { _ThreadTransport }] = await Promise.all([
			import("./logan/_logan.js"), // 0 Logan
			import("./logan/transports/_thread.transport.js"), // 1 Transport
			// import("./logan/transports/_stdout.transport.ts") // 2 Transport
		]);

		const worker = secrets.LOGGER_WORKER_FILE;
		return _GetLogan(new _ThreadTransport(worker));
	}

	if (_service === "winston") {
		const { WinstonLogger } = await import("./_winston.logger.js");
		return WinstonLogger;
	}

	if (_service === "console") {
		const { ConsoleLogger } = await import(`./_console.logger.js`);
		return ConsoleLogger;
	}

	const { ModuleException } = await import("#Domain");
	const message = `Logger service "${_service}" not implemented`;
	return await Promise.reject(new ModuleException(message));
})();
