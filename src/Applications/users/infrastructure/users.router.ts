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
		this.#controller = d.controller;
		this.#router = d.router
			.post("/users/create-role", this.#createRole)
			.patch("/users/:uuid/role-to-user", this.#addUserRole)
			.post("/users", this.#createUser)
			.get("/users", this.#getAllUsers)
			.get("/users/:uuid", this.#getOne)
			.patch("/users/:uuid", this.#patchUser)
			.delete("/users/:uuid", this.#deleteUser);
	}

	get router(): Router {
		return this.#router;
	}

	readonly #getOne: RequestHandler = async (req, res) => {
		const user = await this.#controller.getUser(req);
		return res.status(user.status.code).json(user);
	};

	readonly #getAllUsers: RequestHandler = async (req, res) => {
		const users = await this.#controller.getAllUsers(req);
		return res.status(users.status.code).json(users);
	};

	readonly #createUser: RequestHandler = async (req, res) => {
		const user = await this.#controller.postUser(req);
		return res.status(user.status.code).json(user);
	};

	readonly #createRole: RequestHandler = async (req, res) => {
		const response = await this.#controller.createRole(req);
		return res.status(response.status.code).json(response);
	};

	readonly #patchUser: RequestHandler = async (req, res) => {
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

	readonly #deleteUser: RequestHandler = async (req, res) => {
		const user = await this.#controller.deleteUser(req);
		return res.status(user.status.code).json(user);
	};
};
