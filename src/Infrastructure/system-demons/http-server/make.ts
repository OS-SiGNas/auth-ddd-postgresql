import { secrets } from "#Config";
import { ModuleException } from "#Domain/errors/error.factory.js";

import type { SystemDemon } from "#Domain/SystemDemon.js";

const getHttpServerInstance = async (): Promise<SystemDemon> => {
	let _instance: SystemDemon | undefined;

	if (secrets.HTTP_SERVICE === "express") {
		const { getExpressServer } = await import("./express/make.js");
		_instance = await getExpressServer();
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { getFastifyServer } = await import("./fastify/make.js");
		_instance = await getFastifyServer();
	}

	if (_instance === undefined) throw new ModuleException("HttpServer: instance undefined");

	return await Promise.resolve(_instance);
};

export const httpServer = await getHttpServerInstance();
