import { secrets } from "#Config";
import { ModuleException } from "#Domain";
import type { LoggerConstructor } from "#Domain";

export const Logger = await (async (): Promise<LoggerConstructor> => {
	if (secrets.LOGGER_SERVICE === "console") return (await import(`./_console.logger.js`)).ConsoleLogger;
	if (secrets.LOGGER_SERVICE === "winston") return (await import("./_winston.logger.js")).WinstonLogger;
	throw new ModuleException(`Logger service "${secrets.LOGGER_SERVICE}" not implemented`);
})();
