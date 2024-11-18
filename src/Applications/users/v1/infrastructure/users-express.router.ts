import { endpoints } from "../domain/endpoints.enum.js";
import type { RequestHandler, Router } from "express";
import type { IUsersController } from "../domain/IUsersController";

interface Dependences {
	controller: IUsersController;
}

export class UsersRouterExpress {
	readonly #controller: IUsersController;
	constructor(d: Readonly<Dependences>) {
		this.#controller = d.controller;
	}

	public readonly getRouter = (router: Router): Router =>
		router
			.post(endpoints.CREATE_ROLE, this.#createRole)
			.patch(endpoints.ROLES_TO_USER, this.#rolesToUser)
			.post(endpoints.USERS, this.#createUser)
			.get(endpoints.USERS, this.#getAllUsers)
			.get(endpoints.USERS_UUID, this.#getOne)
			.patch(endpoints.USERS_UUID, this.#patchUser)
			.delete(endpoints.USERS_UUID, this.#deleteUser);

	readonly #getOne: RequestHandler = async (req, res) => {
		const user = await this.#controller.getOneUser(req);
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

	readonly #rolesToUser: RequestHandler = async (req, res) => {
		const response = await this.#controller.rolesToUser(req);
		return res.status(response.status.code).json(response);
	};

	readonly #deleteUser: RequestHandler = async (req, res) => {
		const user = await this.#controller.deleteUser(req);
		return res.status(user.status.code).json(user);
	};
}
