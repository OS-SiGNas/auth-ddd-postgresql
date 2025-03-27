import { endpoints } from "../domain/endpoints.enum.js";
import type { FastifyPluginCallback, RouteHandler, RouteOptions } from "fastify";
import type { IAuthController } from "../domain/IAuthController";
import type { IAuthRequestDTO } from "../domain/IAuthRequestDTO.js";

interface Dependences {
	controller: IAuthController;
	dto: IAuthRequestDTO;
}

export class AuthRouterFastify {
	readonly #controller: IAuthController;
	readonly #dto: IAuthRequestDTO;
	constructor(d: Dependences) {
		this.#controller = d.controller;
		this.#dto = d.dto;
	}

	public readonly plugin: FastifyPluginCallback = (i, _, done) => {
		i.post(endpoints.LOGIN, this.#login);
		i.post(endpoints.REFRESH_TOKEN, this.#refreshToken);
		i.post(endpoints.REGISTER, this.#register);
		i.get(endpoints.ACTIVATE_ACCOUNT, this.#activateAccount);
		i.post(endpoints.FORGOT_PASSWORD, this.#forgotPassword);
		i.patch(endpoints.CHANGE_PASSWORD, this.#changePassword);

		done();
	};

	public readonly getRoutes = (): RouteOptions[] => [
		{ method: "POST", url: endpoints.LOGIN, handler: this.#login },
		{ method: "POST", url: endpoints.REFRESH_TOKEN, handler: this.#refreshToken },
		{ method: "POST", url: endpoints.REGISTER, handler: this.#register },
		{ method: "GET", url: endpoints.ACTIVATE_ACCOUNT, handler: this.#activateAccount },
		{ method: "POST", url: endpoints.FORGOT_PASSWORD, handler: this.#forgotPassword },
		{ method: "PATCH", url: endpoints.CHANGE_PASSWORD, handler: this.#changePassword },
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
