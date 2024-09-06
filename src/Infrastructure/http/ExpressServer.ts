import type { Application, ErrorRequestHandler, RequestHandler } from "express";
import type { Core } from "../../Domain/core/Core";
import type { IServer } from "../../Domain/IServer";
import type { ILogger } from "../../Domain/core/ILogger";

interface Dependences extends Core {
  app: Application;
  globalMiddlewares: RequestHandler[];
  applications: RequestHandler[];
  lastMiddlewares: Array<RequestHandler | ErrorRequestHandler>;
  port: number;
  message: string;
}

export class ExpressServer implements IServer {
  readonly #app: Application;
  readonly #port: number;
  readonly #logger: ILogger;
  readonly #message: string;

  constructor(d: Readonly<Dependences>) {
    this.#port = d.port;
    this.#logger = d.logger;

    this.#app = d.app
      .disable("x-powered-by") // Disabling header x-powered-by
      .use(d.globalMiddlewares) // 1: first position for express global middlewares
      .use(d.applications) // 2: then, api applications endpoints
      .use(d.lastMiddlewares); // 3: finally last position middlewares

    this.#message = d.message;
  }

  public readonly start = async (): Promise<void> => {
    this.#app.listen(this.#port, () => {
      this.#logger.info(`[${this.constructor.name}] Runnin in: http://127.0.0.1:${this.#port}`);
      this.#logger.info(this.#message);
    });
  };

  public readonly stop = async (): Promise<void> => {
    process.exit(0);
  };

  public readonly restart = async (): Promise<void> => {
    console.log("restarting");
  };
}
