import { NODE_ENV } from "#Config";
import type { Server } from "http";
import type { Application, ErrorRequestHandler, RequestHandler } from "express";
import type { Core, ILogger, SystemDemon } from "#Domain";

interface Dependencies extends Core {
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

	constructor(d: Readonly<Dependencies>) {
		this.#isRunning = false;
		this.#app = d.app;
		this.#port = d.port;
		this.#logger = d.logger;

		// 1: first position for express global middlewares
		this.#app.use(d.globalMiddlewares);

		// 2: then, api applications endpoints
		d.apis.forEach((api, i) => this.#app.use(`/v${i + 1}`, api));

		// 3: finally last position middlewares
		this.#app.use(d.lastMiddlewares);
	}

	get app(): Application | undefined {
		if (NODE_ENV !== "testing") return;
		return this.#app;
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
