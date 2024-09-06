import type { RequestHandler, Router } from "express";
import type { IAuthController } from "../domain/IAuthController";

interface Dependences {
  router: Router;
  controller: IAuthController;
}

export const AuthRouter = class {
  static endpoints = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ACTIVE_ACCOUNT: "/auth/active-account",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
  } as const;

  readonly #router: Router;
  readonly #controller: IAuthController;
  constructor(d: Readonly<Dependences>) {
    this.#controller = d.controller;
    this.#router = d.router

      .post(AuthRouter.endpoints.LOGIN, this.#login)
      .post(AuthRouter.endpoints.REGISTER, this.#register)
      .get(AuthRouter.endpoints.ACTIVE_ACCOUNT + "/:token", this.#activateAccount)
      .post(AuthRouter.endpoints.FORGOT_PASSWORD, this.#forgotPassword)
      .patch(AuthRouter.endpoints.CHANGE_PASSWORD, this.#changePassword);
  }

  get router(): Router {
    return this.#router;
  }

  readonly #login: RequestHandler = async (req, res) => {
    const login = await this.#controller.login(req);
    return res.status(login.status.code).json(login);
  };

  readonly #register: RequestHandler = async (req, res) => {
    const register = await this.#controller.register(req);
    return res.status(register.status.code).json(register);
  };

  readonly #activateAccount: RequestHandler = async (req, res) => {
    const activateAccount = await this.#controller.activateAccount(req);
    return res.status(activateAccount.status.code).json(activateAccount);
  };

  readonly #forgotPassword: RequestHandler = async (req, res) => {
    const forgotPassword = await this.#controller.forgotPassword(req);
    return res.status(forgotPassword.status.code).json(forgotPassword);
  };

  readonly #changePassword: RequestHandler = async (req, res) => {
    const changePassword = await this.#controller.changePassword(req);
    return res.status(changePassword.status.code).json(changePassword);
  };
};
