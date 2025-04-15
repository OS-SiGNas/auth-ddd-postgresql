import type { FastifyInstance, FastifyPluginCallback } from "fastify";
import type { Core } from "#Domain/core/Core";
import type { SystemDemon } from "#Domain/SystemDemon";
import type { ILogger } from "#Domain/core/ILogger";

interface Dependencies extends Core {
	app: FastifyInstance;
	globalMiddlewares: FastifyPluginCallback[];
	apis: FastifyPluginCallback[][];
	port: number;
}

export class FastifyServer implements SystemDemon {
	readonly #app: FastifyInstance;
	readonly #port: number;
	readonly #logger: ILogger;
	#isRunning: boolean;
	constructor(d: Readonly<Dependencies>) {
		this.#isRunning = false;
		this.#app = d.app;
		this.#port = d.port;
		this.#logger = d.logger;
		// d.apis.forEach((api) => api.forEach((route) => this.#app.route(route)));
		d.globalMiddlewares.forEach((plugin) => this.#app.register(plugin));
		d.apis.forEach((api, i) => api.forEach((plugin) => this.#app.register(plugin, { prefix: `v${i + 1}` })));
	}

	public readonly start = async (): Promise<void> => {
		if (this.#isRunning) return;
		this.#logger.info("Starting http server");
		await this.#app.listen({ port: this.#port });
		this.#logger.info(`Running in: http://127.0.0.1:${this.#port}`);
		this.#isRunning = true;
	};

	public readonly stop = async (): Promise<void> => {
		if (!this.#isRunning) return;
		await this.#app.close();
		this.#isRunning = false;
	};

	public readonly restart = async (): Promise<void> => {
		this.#logger.info("restarting");
		await this.stop();
		await Promise.resolve(this.start());
	};
}
