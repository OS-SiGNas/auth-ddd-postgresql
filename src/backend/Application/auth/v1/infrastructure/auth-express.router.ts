import { ENDPOINTS } from "../domain/endpoints.enum.js";
import type { CookieOptions, RequestHandler, Router } from "express";
import type { IAuthController } from "../domain/IAuthController.js";
import type { IAuthRequestDTO } from "../domain/IAuthRequestDTO.js";
import { NODE_ENV } from "#Config";

interface Dependencies {
	controller: IAuthController;
	dto: IAuthRequestDTO;
}

export class AuthRouterExpress {
	readonly #controller: IAuthController;
	readonly #dto: IAuthRequestDTO;
	constructor(d: Readonly<Dependencies>) {
		this.#controller = d.controller;
		this.#dto = d.dto;
	}

	public readonly getRouter = (router: Router): Router =>
		router
			.post(ENDPOINTS.LOGIN, this.#login)
			.post(ENDPOINTS.REFRESH_TOKEN, this.#refreshToken)
			.post(ENDPOINTS.REGISTER, this.#register)
			.patch(ENDPOINTS.ACTIVATE_ACCOUNT, this.#activateAccount)
			.post(ENDPOINTS.FORGOT_PASSWORD, this.#forgotPassword)
			.patch(ENDPOINTS.CHANGE_PASSWORD, this.#changePassword);

	readonly #login: RequestHandler = async (req, res) => {
		const payload = await this.#dto.login(req);
		const { status, error, data, metadata, pagination } = await this.#controller.login(payload);
		if (error !== undefined) res.status(status.code).json({ status, error });
		else {
			const options: CookieOptions = {
				secure: NODE_ENV === "production",
				maxAge: 1000 * 60 * 60,
				sameSite: "strict",
				httpOnly: true,
			};

			res.cookie("access_token", data?.session.accessToken, options);
			res.cookie("refresh_token", data?.session.refreshToken, options);
			res.status(status.code).json({ status, pagination, metadata, data: data?.user });
		}
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
