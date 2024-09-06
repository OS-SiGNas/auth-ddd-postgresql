import { Router, type RequestHandler } from "express";

/**
 * overwriting default html response for not found endpoints
 * with only http status code 404 */
const NotFound = class {
  static readonly #router = Router();
  static readonly #controller: RequestHandler = (_, res) => res.sendStatus(404);
  static get router(): Router {
    return this.#router
      .head("/", this.#controller)
      .options("/", this.#controller)
      .get("/", this.#controller)
      .post("/", this.#controller)
      .put("/", this.#controller)
      .patch("/", this.#controller)
      .delete("/", this.#controller)

      .head("*", this.#controller)
      .options("*", this.#controller)
      .get("*", this.#controller)
      .post("*", this.#controller)
      .put("*", this.#controller)
      .patch("*", this.#controller)
      .delete("*", this.#controller)

      .get("/404", this.#controller);
  }
};

export const notFound = NotFound.router;
