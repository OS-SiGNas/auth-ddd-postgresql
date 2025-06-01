import { ENDPOINTS } from "../domain/endpoints.enum.js";
import type { FastifyPluginCallback, RouteHandler, RouteOptions } from "fastify";
import type { IAuthController } from "../domain/IAuthController.js";
import type { IAuthRequestDTO } from "../domain/IAuthRequestDTO.js";

interface Dependencies {
	controller: IAuthController;
	dto: IAuthRequestDTO;
}

export class AuthRouterFastify {
	readonly #controller: IAuthController;
	readonly #dto: IAuthRequestDTO;
	constructor(d: Dependencies) {
		this.#controller = d.controller;
		this.#dto = d.dto;
	}

	public readonly plugin: FastifyPluginCallback = (i, _, done) => {
		i.post(ENDPOINTS.LOGIN, this.#login);
		i.post(ENDPOINTS.REFRESH_TOKEN, this.#refreshToken);
		i.post(ENDPOINTS.REGISTER, this.#register);
		i.patch(ENDPOINTS.ACTIVATE_ACCOUNT, this.#activateAccount);
		i.post(ENDPOINTS.FORGOT_PASSWORD, this.#forgotPassword);
		i.patch(ENDPOINTS.CHANGE_PASSWORD, this.#changePassword);

		done();
	};

	public readonly getRoutes = (): RouteOptions[] => [
		{ method: "POST", url: ENDPOINTS.LOGIN, handler: this.#login },
		{ method: "POST", url: ENDPOINTS.REFRESH_TOKEN, handler: this.#refreshToken },
		{ method: "POST", url: ENDPOINTS.REGISTER, handler: this.#register },
		{ method: "PATCH", url: ENDPOINTS.ACTIVATE_ACCOUNT, handler: this.#activateAccount },
		{ method: "POST", url: ENDPOINTS.FORGOT_PASSWORD, handler: this.#forgotPassword },
		{ method: "PATCH", url: ENDPOINTS.CHANGE_PASSWORD, handler: this.#changePassword },
	];

	readonly #login: RouteHandler = async (req, res) => {
		const login = await this.#controller.login(await this.#dto.login(req));
		return res.status(login.status.code).send(login);
	};

	readonly #refreshToken: RouteHandler = async (req, res) => {
		const response = await this.#controller.refreshToken(await this.#dto.refreshToken(req));
		return res.status(response.status.code).send(response);
	};

	readonly #register: RouteHandler = async (req, res) => {
		const register = await this.#controller.register(await this.#dto.register(req));
		return res.status(register.status.code).send(register);
	};

	readonly #activateAccount: RouteHandler = async (req, res) => {
		const activateAccount = await this.#controller.activateAccount(await this.#dto.activateAccount(req));
		return res.status(activateAccount.status.code).send(activateAccount);
	};

	readonly #forgotPassword: RouteHandler = async (req, res) => {
		const forgotPassword = await this.#controller.forgotPassword(await this.#dto.forgotPassword(req));
		return res.status(forgotPassword.status.code).send(forgotPassword);
	};

	readonly #changePassword: RouteHandler = async (req, res) => {
		const changePassword = await this.#controller.changePassword(await this.#dto.changePassword(req));
		return res.status(changePassword.status.code).send(changePassword);
	};
}
