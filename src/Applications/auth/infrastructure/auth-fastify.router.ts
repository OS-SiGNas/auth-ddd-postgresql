import type { RouteHandler, RouteOptions } from "fastify";
import type { IAuthController } from "../domain/IAuthController";

interface Dependences {
	controller: IAuthController;
}

export class AuthRouterFastify {
	readonly #controller: IAuthController;
	constructor(d: Dependences) {
		this.#controller = d.controller;
	}

	public readonly getRoutes = (): RouteOptions[] => [
		{ method: "POST", url: "/auth/login", handler: this.#login },
		{ method: "POST", url: "/auth/refresh", handler: this.#refreshToken },
		{ method: "POST", url: "/auth/register", handler: this.#register },
		{ method: "GET", url: "/auth/account-activation/:token", handler: this.#accountActivation },
		{ method: "POST", url: "/auth/activate-account", handler: this.#activateAccount },
		{ method: "POST", url: "/auth/forgot-password", handler: this.#forgotPassword },
		{ method: "PATCH", url: "/auth/change-password", handler: this.#changePassword },
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

	readonly #accountActivation: RouteHandler = async (req, res) => {
		const accountActivation = await this.#controller.accountActivation(req);
		return res.status(accountActivation.status.code).send(accountActivation);
	};

	readonly #activateAccount: RouteHandler = async (req, res) => {
		const activateAccount = await this.#controller.activateAccount(req);
		return res.status(activateAccount.status.code).send(activateAccount);
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
