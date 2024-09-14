import type { RouteHandler, RouteOptions } from "fastify";
import type { IUsersController } from "../domain/IUsersController";

interface Dependences {
	controller: IUsersController;
}

export class UsersRouterFastify {
	readonly #controller: IUsersController;
	constructor(d: Dependences) {
		this.#controller = d.controller;
	}

	public readonly getRoutes = (): RouteOptions[] => [
		{ method: "POST", url: "/users/create-role", handler: this.#createRole },
		{ method: "PATCH", url: "/users/:uuid/role-to-user", handler: this.#addUserRole },
		{ method: "POST", url: "/users", handler: this.#createUser },
		{ method: "GET", url: "/users", handler: this.#getAllUsers },
		{ method: "GET", url: "/users/:uuid", handler: this.#getOne },
		{ method: "PATCH", url: "/users/:uuid", handler: this.#patchUser },
		{ method: "DELETE", url: "/users/:uuid", handler: this.#deleteUser },
	];

	readonly #getOne: RouteHandler = async (req, res) => {
		const user = await this.#controller.getOneUser(req);
		return res.status(user.status.code).send(user);
	};

	readonly #getAllUsers: RouteHandler = async (req, res) => {
		const users = await this.#controller.getAllUsers(req);
		return res.status(users.status.code).send(users);
	};

	readonly #createUser: RouteHandler = async (req, res) => {
		const user = await this.#controller.postUser(req);
		return res.status(user.status.code).send(user);
	};

	readonly #createRole: RouteHandler = async (req, res) => {
		const response = await this.#controller.createRole(req);
		return res.status(response.status.code).send(response);
	};

	readonly #patchUser: RouteHandler = async (req, res) => {
		const user = await this.#controller.patchUser(req);
		return res.status(user.status.code).send(user);
	};

	readonly #addUserRole: RouteHandler = async (req, res) => {
		const response = await this.#controller.addUserRole(req);
		return res.status(response.status.code).send(response);
	};

	readonly #deleteUser: RouteHandler = async (req, res) => {
		const user = await this.#controller.deleteUser(req);
		return res.status(user.status.code).send(user);
	};
}
