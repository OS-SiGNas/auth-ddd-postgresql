import type { FastifyInstance, RouteOptions } from "fastify";

import type { Core } from "../../Domain/core/Core";
import type { IServer } from "../../Domain/IServer";
import type { ILogger } from "../../Domain/core/ILogger";

interface Dependences extends Core {
	app: FastifyInstance;
	applications: RouteOptions[];
	port: number;
	message: string;
}

export class FastifyServer implements IServer {
	readonly #app: FastifyInstance;
	readonly #port: number;
	readonly #logger: ILogger;
	readonly #message: string;
	constructor(d: Readonly<Dependences>) {
		this.#app = d.app;
		this.#port = d.port;
		this.#logger = d.logger;
		this.#message = d.message;
		d.applications.forEach((route) => this.#app.route(route));
	}

	public readonly start = async (): Promise<void> => {
		await this.#app.listen({ port: this.#port });
		this.#logger.info(`Running in: http://127.0.0.1:${this.#port} ${this.#message}`);
	};

	public readonly stop = async (): Promise<void> => {
		process.exit(0);
	};

	public readonly restart = async (): Promise<void> => {
		this.#logger.info("restarting");
	};
}
