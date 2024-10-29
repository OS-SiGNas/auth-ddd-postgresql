import { endpoints } from "../domain/endpoints.enum.js";
import type { RequestHandler, Router } from "express";
import type { IAuthController } from "../domain/IAuthController";

interface Dependences {
	controller: IAuthController;
}

export class AuthRouterExpress {
	readonly #controller: IAuthController;
	constructor(d: Readonly<Dependences>) {
		this.#controller = d.controller;
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
		const login = await this.#controller.login(req);
		return res.status(login.status.code).json(login);
	};

	readonly #refreshToken: RequestHandler = async (req, res) => {
		const response = await this.#controller.refreshToken(req);
		return res.status(response.status.code).json(response);
	};

	readonly #register: RequestHandler = async (req, res) => {
		const register = await this.#controller.register(req);
		return res.status(register.status.code).json(register);
	};

	readonly #activateAccount: RequestHandler = async (req, res) => {
		const accountActivation = await this.#controller.activateAccount(req);
		return res.status(accountActivation.status.code).json(accountActivation);
	};

	readonly #forgotPassword: RequestHandler = async (req, res) => {
		const forgotPassword = await this.#controller.forgotPassword(req);
		return res.status(forgotPassword.status.code).json(forgotPassword);
	};

	readonly #changePassword: RequestHandler = async (req, res) => {
		const changePassword = await this.#controller.changePassword(req);
		return res.status(changePassword.status.code).json(changePassword);
	};
}
