import { secrets } from "#Config";
import { ModuleException } from "#Domain";
import type { LoggerConstructor } from "#Domain";

const __make = async (): Promise<LoggerConstructor> => {
	const service = secrets.LOGGER_SERVICE;

	if (service === "console") {
		const { ConsoleLogger } = await import(`./_console.logger.js`);
		return ConsoleLogger;
	}

	if (service === "winston") {
		const { WinstonLogger } = await import("./_winston.logger.js");
		return WinstonLogger;
	}

	if (service === "logan") {
		const { _getLogan } = await import("./logan/_logan.js");
		const { threadTransport } = await import("./logan/transports/thread.transport.js");
		// const { _StdOutTransport } = await import("./logan/transports/stdout.transport.js");
		return _getLogan(threadTransport);
	}

	const error = new ModuleException(`Logger service "${service}" not implemented`);
	return Promise.reject(error);
};

export const Logger = await __make();
