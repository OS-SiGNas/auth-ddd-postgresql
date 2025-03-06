import type { Server } from "http";
import type { Application, ErrorRequestHandler, RequestHandler } from "express";
import type { Core } from "#Domain/core/Core";
import type { SystemDemon } from "#Domain/SystemDemon";
import type { ILogger } from "#Domain/core/ILogger";

interface Dependences extends Core {
	app: Application;
	globalMiddlewares: RequestHandler[];
	apis: RequestHandler[][];
	lastMiddlewares: Array<RequestHandler | ErrorRequestHandler>;
	port: number;
}

export class ExpressServer implements SystemDemon {
	readonly #app: Application;
	readonly #port: number;
	readonly #logger: ILogger;
	#httpServer?: Server;
	#isRunning: boolean;

	constructor(d: Readonly<Dependences>) {
		this.#isRunning = false;
		this.#app = d.app;
		this.#port = d.port;
		this.#logger = d.logger;

		this.#app.use(d.globalMiddlewares); // 1: first position for express global middlewares
		d.apis.forEach((api, i) => this.#app.use(`/v${i + 1}`, api)); // 2: then, api applications endpoints
		this.#app.use(d.lastMiddlewares); // 3: finally last position middlewares
	}

	public readonly start = async (): Promise<void> => {
		if (this.#isRunning) return;
		this.#logger.info("Starting http server");
		this.#httpServer = this.#app.listen(this.#port, () => {
			this.#logger.info(`Running in: http://127.0.0.1:${this.#port}`);
			this.#isRunning = true;
		});
	};

	public readonly stop = async (): Promise<void> => {
		if (!this.#isRunning) return;
		this.#httpServer?.closeIdleConnections();
		this.#httpServer?.close();
		this.#isRunning = false;
		Promise.resolve(this.#logger.info(`Stopped`));
	};

	public readonly restart = async (): Promise<void> => {
		this.#logger.info("Restarting");
		await this.stop();
		await Promise.resolve(this.start());
	};
}
