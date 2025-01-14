import { secrets } from "#config";
import { ModuleException } from "#Domain/core/errors.factory.js";

import type { Logger as WinstonLogger } from "./winston.logger";
import type { Logger as ConsoleLogger } from "./console.logger";

type PromiseLogger = Promise<typeof WinstonLogger | typeof ConsoleLogger>;
export const Logger = await (async (): PromiseLogger => {
	if (secrets.LOGGER_SERVICE === "console") return (await import("./console.logger.js")).Logger;
	if (secrets.LOGGER_SERVICE === "winston") return (await import("./winston.logger.js")).Logger;
	throw new ModuleException("Logger class undefined", 500);
})();
