import { secrets } from "#Domain/config.js";

//export { Logger } from "./winston.logger.js";
//export { Logger } from "./console.logger.js";

export const { Logger } = await import(`./${secrets.LOGGER_SERVICE}.logger.js`);
