import type { RequestHandler, Router } from "express";
import type { IUsersController } from "../domain/IUsersController";

interface Dependences {
  router: Router;
  controller: IUsersController;
}

export const UsersRouter = class {
  readonly #router: Router;
  readonly #controller: IUsersController;

  constructor(d: Readonly<Dependences>) {
    const endpoint = "/users";

    this.#controller = d.controller;
    this.#router = d.router
      .get(endpoint + "/all", this.#getAll)
      .get(endpoint + "/one/:uuid", this.#get)
      .post(endpoint, this.#post)
      .post(endpoint + "/create-role", this.#createRole)
      .patch(endpoint + "/add-user-role/:uuid", this.#addUserRole)
      .patch(endpoint + "/one/:uuid", this.#patch)
      // .put(endpoint + "/:uuid", this.#put)
      .delete(endpoint + "/one/:uuid", this.#delete);
  }

  get router(): Router {
    return this.#router;
  }

  readonly #get: RequestHandler = async (req, res) => {
    const user = await this.#controller.getUser(req);
    return res.status(user.status.code).json(user);
  };

  readonly #getAll: RequestHandler = async (req, res) => {
    const users = await this.#controller.getAllUsers(req);
    return res.status(users.status.code).json(users);
  };

  readonly #post: RequestHandler = async (req, res) => {
    const user = await this.#controller.postUser(req);
    return res.status(user.status.code).json(user);
  };

  readonly #createRole: RequestHandler = async (req, res) => {
    const response = await this.#controller.createRole(req);
    return res.status(response.status.code).json(response);
  };

  readonly #patch: RequestHandler = async (req, res) => {
    const user = await this.#controller.patchUser(req);
    return res.status(user.status.code).json(user);
  };

  readonly #addUserRole: RequestHandler = async (req, res) => {
    const response = await this.#controller.addUserRole(req);
    return res.status(response.status.code).json(response);
  };

  /*   readonly #put: RequestHandler = async (req, res) => {
    const user = await this.#controller.putUser(req.body);
    return res.status(user.status.code).json(user);
  }; */

  readonly #delete: RequestHandler = async (req, res) => {
    const user = await this.#controller.deleteUser(req.body);
    return res.status(user.status.code).json(user);
  };
};
