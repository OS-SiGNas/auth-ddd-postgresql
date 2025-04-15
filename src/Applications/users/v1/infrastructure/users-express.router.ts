import { endpoints } from "../domain/endpoints.enum.js";
import type { Router } from "express";
import type { IUsersController } from "../domain/IUsersController";
import type { IUsersRequestDTO } from "../domain/IUsersRequestDTO.js";

interface Dependencies {
	controller: IUsersController;
	dto: IUsersRequestDTO;
}

export class UsersRouterExpress {
	readonly #controller: IUsersController;
	readonly #dto: IUsersRequestDTO;
	constructor(d: Readonly<Dependencies>) {
		this.#controller = d.controller;
		this.#dto = d.dto;
	}

	public readonly getRouter = (router: Router): Router => {
		router.post(endpoints.CREATE_ROLE, async (req, res) => {
			const dto = await this.#dto.createRole(req);
			const response = await this.#controller.createRole(dto);
			return res.status(response.status.code).json(response);
		});

		router.patch(endpoints.ROLES_TO_USER, async (req, res) => {
			const dto = await this.#dto.rolesToUser(req);
			const response = await this.#controller.rolesToUser(dto);
			return res.status(response.status.code).json(response);
		});

		router.post(endpoints.USERS, async (req, res) => {
			const dto = await this.#dto.createUser(req);
			const response = await this.#controller.postUser(dto);
			return res.status(response.status.code).json(response);
		});

		router.get(endpoints.USERS, async (req, res) => {
			const dto = await this.#dto.getAllUsers(req);
			const response = await this.#controller.getAllUsers(dto);
			return res.status(response.status.code).json(response);
		});

		router.get(endpoints.USERS_UUID, async (req, res) => {
			const dto = await this.#dto.getOneUser(req);
			const response = await this.#controller.getOneUser(dto);
			return res.status(response.status.code).json(response);
		});

		router.patch(endpoints.USERS_UUID, async (req, res) => {
			const dto = await this.#dto.updateUser(req);
			const response = await this.#controller.patchUser(dto);
			return res.status(response.status.code).json(response);
		});

		router.delete(endpoints.USERS_UUID, async (req, res) => {
			const dto = await this.#dto.deleteUser(req);
			const response = await this.#controller.deleteUser(dto);
			return res.status(response.status.code).json(response);
		});

		return router;
	};
}
