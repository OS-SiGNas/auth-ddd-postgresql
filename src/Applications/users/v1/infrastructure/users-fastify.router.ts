import { endpoints } from "../domain/endpoints.enum.js";
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
		{ method: "POST", url: endpoints.CREATE_ROLE, handler: this.#createRole },
		{ method: "PATCH", url: endpoints.ROLES_TO_USER, handler: this.#rolesToUser },
		{ method: "POST", url: endpoints.USERS, handler: this.#createUser },
		{ method: "GET", url: endpoints.USERS, handler: this.#getAllUsers },
		{ method: "GET", url: endpoints.USERS_UUID, handler: this.#getOne },
		{ method: "PATCH", url: endpoints.USERS_UUID, handler: this.#patchUser },
		{ method: "DELETE", url: endpoints.USERS_UUID, handler: this.#deleteUser },
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

	readonly #rolesToUser: RouteHandler = async (req, res) => {
		const response = await this.#controller.rolesToUser(req);
		return res.status(response.status.code).send(response);
	};

	readonly #deleteUser: RouteHandler = async (req, res) => {
		const user = await this.#controller.deleteUser(req);
		return res.status(user.status.code).send(user);
	};
}
