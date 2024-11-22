import { endpoints } from "../domain/endpoints.enum.js";
import type { FastifyPluginCallback, RouteHandler, RouteOptions } from "fastify";
import type { IAuthController } from "../domain/IAuthController";

interface Dependences {
	controller: IAuthController;
}

export class AuthRouterFastify {
	readonly #controller: IAuthController;
	constructor(d: Dependences) {
		this.#controller = d.controller;
	}

	public readonly plugin: FastifyPluginCallback = (instance, _, done) => {
		instance.post(endpoints.LOGIN, this.#login);
		instance.post(endpoints.REFRESH_TOKEN, this.#refreshToken);
		instance.post(endpoints.REGISTER, this.#register);
		instance.get(endpoints.ACTIVATE_ACCOUNT, this.#activateAccount);
		instance.post(endpoints.FORGOT_PASSWORD, this.#forgotPassword);
		instance.patch(endpoints.CHANGE_PASSWORD, this.#changePassword);

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
		const login = await this.#controller.login(req);
		return res.status(login.status.code).send(login);
	};

	readonly #refreshToken: RouteHandler = async (req, res) => {
		const response = await this.#controller.refreshToken(req);
		return res.status(response.status.code).send(response);
	};

	readonly #register: RouteHandler = async (req, res) => {
		const register = await this.#controller.register(req);
		return res.status(register.status.code).send(register);
	};

	readonly #activateAccount: RouteHandler = async (req, res) => {
		const accountActivation = await this.#controller.activateAccount(req);
		return res.status(accountActivation.status.code).send(accountActivation);
	};

	readonly #forgotPassword: RouteHandler = async (req, res) => {
		const forgotPassword = await this.#controller.forgotPassword(req);
		return res.status(forgotPassword.status.code).send(forgotPassword);
	};

	readonly #changePassword: RouteHandler = async (req, res) => {
		const changePassword = await this.#controller.changePassword(req);
		return res.status(changePassword.status.code).send(changePassword);
	};
}
