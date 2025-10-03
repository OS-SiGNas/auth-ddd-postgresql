//import process from "./strategys/process.strategy.ts";
//import core from "./strategys/core.strategy.ts";

import thread from "./strategys/thread.strategy.ts";
import { _LoggerListener } from "./logger.listener.ts";

export const loggerListener = new _LoggerListener(
	thread
	// core
	// process
);
