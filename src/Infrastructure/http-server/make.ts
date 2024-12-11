import { secrets } from "#Domain/config.js";
import { ModuleException } from "#Domain/core/errors.factory.js";

import type { Environment } from "#Domain/config.js";
import type { IServer } from "#Domain/IServer";

const getHttpServerInstance = async (): Promise<IServer> => {
	let _instance: IServer | undefined;

	const _message: Record<Environment, string> = {
		development: "👽 DEV MODE 👽",
		testing: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	} as const;

	if (secrets.HTTP_SERVICE === "express") {
		const { getExpressServer } = await import("./express/make.js");
		_instance = await getExpressServer(_message[secrets.NODE_ENV]);
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { getFastifyServer } = await import("./fastify/make.js");
		_instance = await getFastifyServer(_message[secrets.NODE_ENV]);
	}

	if (_instance === undefined) throw new ModuleException("HttpServer: instance undefined", 500);
	return await Promise.resolve(_instance);
};

export const httpServer = await getHttpServerInstance();
