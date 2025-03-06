import { endpoints } from "../domain/endpoints.enum.js";
import type { RequestHandler, Router } from "express";
import type { IAuthController } from "../domain/IAuthController";
import type { IAuthRequestDTO } from "../domain/IAuthRequestDTO.js";

interface Dependences {
	controller: IAuthController;
	dto: IAuthRequestDTO;
}

export class AuthRouterExpress {
	readonly #controller: IAuthController;
	readonly #dto: IAuthRequestDTO;
	constructor(d: Readonly<Dependences>) {
		this.#controller = d.controller;
		this.#dto = d.dto;
	}

	public readonly getRouter = (router: Router): Router =>
		router
			.post(endpoints.LOGIN, this.#login)
			.post(endpoints.REFRESH_TOKEN, this.#refreshToken)
			.post(endpoints.REGISTER, this.#register)
			.get(endpoints.ACTIVATE_ACCOUNT, this.#activateAccount)
			.post(endpoints.FORGOT_PASSWORD, this.#forgotPassword)
			.patch(endpoints.CHANGE_PASSWORD, this.#changePassword);

	readonly #login: RequestHandler = async (req, res) => {
		const parsed = await this.#dto.login(req);
		const login = await this.#controller.login(parsed);
		return res.status(login.status.code).json(login);
	};

	readonly #refreshToken: RequestHandler = async (req, res) => {
		const refreshToken = await this.#controller.refreshToken(await this.#dto.refreshToken(req));
		return res.status(refreshToken.status.code).json(refreshToken);
	};

	readonly #register: RequestHandler = async (req, res) => {
		const register = await this.#controller.register(await this.#dto.register(req));
		return res.status(register.status.code).json(register);
	};

	readonly #activateAccount: RequestHandler = async (req, res) => {
		const activateAccount = await this.#controller.activateAccount(await this.#dto.activateAccount(req));
		return res.status(activateAccount.status.code).json(activateAccount);
	};

	readonly #forgotPassword: RequestHandler = async (req, res) => {
		const forgotPassword = await this.#controller.forgotPassword(await this.#dto.forgotPassword(req));
		return res.status(forgotPassword.status.code).json(forgotPassword);
	};

	readonly #changePassword: RequestHandler = async (req, res) => {
		const changePassword = await this.#controller.changePassword(await this.#dto.changePassword(req));
		return res.status(changePassword.status.code).json(changePassword);
	};
}
