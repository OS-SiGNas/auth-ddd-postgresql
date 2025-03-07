import { secrets } from "#Config";
import { ModuleException } from "#Domain/errors/error.factory.js";
import type { LoggerConstructor } from "#Domain/core/ILogger";

export const Logger = await (async (): Promise<LoggerConstructor> => {
	const { LOGGER_SERVICE } = secrets;
	if (LOGGER_SERVICE === "console") return (await import(`./_console.logger.js`)).ConsoleLogger;
	if (LOGGER_SERVICE === "winston") return (await import("./_winston.logger.js")).WinstonLogger;
	throw new ModuleException(`Logger service "${LOGGER_SERVICE}" not implemented`);
})();
