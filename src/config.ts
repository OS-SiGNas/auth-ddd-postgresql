import { _Config } from "#Domain";
import { secretsParser } from "./Application/secrets.parser.js";

export const { NODE_ENV, secrets, DEBUG } = new _Config(secretsParser);
