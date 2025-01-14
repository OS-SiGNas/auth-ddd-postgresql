import { secrets, NODE_ENV } from "#config";
import { ModuleException } from "#Domain/core/errors.factory.js";

import type { IServer } from "#Domain/IServer";

const getHttpServerInstance = async (): Promise<IServer> => {
	let _instance: IServer | undefined;

	// eslint-disable-next-line security/detect-object-injection
	const _message = {
		development: "👽 DEV MODE 👽",
		testing: "🪲 TEST MODE 🪲",
		production: "🔥 ON 🔥",
	}[NODE_ENV];

	if (secrets.HTTP_SERVICE === "express") {
		const { getExpressServer } = await import("./express/make.js");
		_instance = await getExpressServer(_message);
	}

	if (secrets.HTTP_SERVICE === "fastify") {
		const { getFastifyServer } = await import("./fastify/make.js");
		_instance = await getFastifyServer(_message);
	}

	if (_instance === undefined) throw new ModuleException("HttpServer: instance undefined", 500);
	return await Promise.resolve(_instance);
};

export const httpServer = await getHttpServerInstance();
