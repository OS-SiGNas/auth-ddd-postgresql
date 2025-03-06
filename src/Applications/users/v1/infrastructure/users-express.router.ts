import { endpoints } from "../domain/endpoints.enum.js";
import type { RequestHandler, Router } from "express";
import type { IUsersController } from "../domain/IUsersController";
import type { IUsersRequestDTO } from "../domain/IUsersRequestDTO.js";

interface Dependences {
	controller: IUsersController;
	dto: IUsersRequestDTO;
}

export class UsersRouterExpress {
	readonly #controller: IUsersController;
	readonly #dto: IUsersRequestDTO;
	constructor(d: Readonly<Dependences>) {
		this.#controller = d.controller;
		this.#dto = d.dto;
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
		const response = await this.#controller.getOneUser(await this.#dto.getOneUser(req));
		return res.status(response.status.code).json(response);
	};

	readonly #getAllUsers: RequestHandler = async (req, res) => {
		const response = await this.#controller.getAllUsers(await this.#dto.getAllUsers(req));
		return res.status(response.status.code).json(response);
	};

	readonly #createUser: RequestHandler = async (req, res) => {
		const response = await this.#controller.postUser(await this.#dto.createUser(req));
		return res.status(response.status.code).json(response);
	};

	readonly #createRole: RequestHandler = async (req, res) => {
		const response = await this.#controller.createRole(await this.#dto.createRole(req));
		return res.status(response.status.code).json(response);
	};

	readonly #patchUser: RequestHandler = async (req, res) => {
		const response = await this.#controller.patchUser(await this.#dto.updateUser(req));
		return res.status(response.status.code).json(response);
	};

	readonly #rolesToUser: RequestHandler = async (req, res) => {
		const response = await this.#controller.rolesToUser(await this.#dto.rolesToUser(req));
		return res.status(response.status.code).json(response);
	};

	readonly #deleteUser: RequestHandler = async (req, res) => {
		const response = await this.#controller.deleteUser(await this.#dto.deleteUser(req));
		return res.status(response.status.code).json(response);
	};
}
