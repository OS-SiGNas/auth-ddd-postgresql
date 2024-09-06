import type { ILogger } from "../../../Domain/core/ILogger";
import type { ErrorType, IErrorHandler } from "../../../Domain/core/IErrorHandler";
// Errors
import { DomainError } from "../../../Domain/core/errors.factory.js";
import { ZodError } from "zod";

interface Dependences {
  logger: ILogger;
}

export class _ErrorHandler implements IErrorHandler {
  static #instance?: _ErrorHandler;
  static getInstance = (d: Readonly<Dependences>): _ErrorHandler => (this.#instance ??= new _ErrorHandler(d));

  readonly #logger: ILogger;
  private constructor(d: Readonly<Dependences>) {
    this.#logger = d.logger;
  }

  public readonly catch = (name: string, error?: ErrorType): void => {
    this.#logger.debug(`NAME: ${name}Error 💩`);
    if (error === undefined) return;

    /**
     * Strategies to handle different errors
     
    if (error instanceof StepError) this.#stepErrorsHandler(error)
    if (error instanceof ResponseError) this.#responseErrorHandler(error)
    if (state !== undefined && error instanceof ErrorBusiness) state.response = error;
    if (error instanceof TransactionError) this.#TransactionErrorsHandler(error) */
    if (error instanceof DomainError) this.#errorBusiness(error);
    if (error instanceof ZodError) this.#errorZod(error);
  };

  readonly #errorBusiness = (error: DomainError): void => {
    this.#logger.debug(error);
  };

  readonly #errorZod = (error: ZodError): void => {
    this.#logger.debug(error.issues.map((error) => ({ path: error.path.join(": ") })));
  };
}
