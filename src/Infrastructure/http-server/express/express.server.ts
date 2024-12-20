import type { Server } from "http";
import type { Application, ErrorRequestHandler, RequestHandler } from "express";
import type { Core } from "#Domain/core/Core";
import type { IServer } from "#Domain/IServer";
import type { ILogger } from "#Domain/core/ILogger";

interface Dependences extends Core {
	app: Application;
	globalMiddlewares: RequestHandler[];
	apis: RequestHandler[][];
	lastMiddlewares: Array<RequestHandler | ErrorRequestHandler>;
	port: number;
	message: string;
}

export class ExpressServer implements IServer {
	readonly #app: Application;
	readonly #port: number;
	readonly #logger: ILogger;
	readonly #message: string;
	#httpServer?: Server;

	constructor(d: Readonly<Dependences>) {
		this.#app = d.app;
		this.#port = d.port;
		this.#message = d.message;
		this.#logger = d.logger;

		this.#app.use(d.globalMiddlewares); // 1: first position for express global middlewares
		d.apis.forEach((api, i) => this.#app.use(`/v${i + 1}`, api)); // 2: then, api applications endpoints
		this.#app.use(d.lastMiddlewares); // 3: finally last position middlewares
	}

	public readonly start = async (): Promise<void> => {
		this.#httpServer = this.#app.listen(this.#port, () => {
			this.#logger.info(`Running in: http://127.0.0.1:${this.#port} ${this.#message}`);
		});
	};

	public readonly stop = (): void => {
		this.#httpServer?.closeIdleConnections();
		this.#httpServer?.close();
		this.#logger.info(`Stopped`);
	};

	public readonly restart = async (): Promise<void> => {
		this.#logger.info("Restarting");
		this.#httpServer?.close();
		await Promise.resolve(this.start());
	};
}
