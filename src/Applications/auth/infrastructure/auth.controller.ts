import type { ControllerHandler, ControllersDependences } from "../../../Domain/business/Business";
import type { IErrorHandler } from "../../../Domain/core/IErrorHandler";
import type { IResponseHandler } from "../../../Domain/business/IResponseHandler";
import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { UserSessionDTO } from "../../users/domain/users.dto.js";
import type { IAuthRequestDTO } from "../../users/domain/IAuthRequestDTO";
import type { UserNonSensitiveData } from "../../users/domain/IUser";
import type { IAuthBusiness } from "../domain/IAuthBusiness";
import type { IAuthController } from "../domain/IAuthController";
import type { ActivateAccountRequest } from "../domain/request/activate-account.request";

import { HttpStatus } from "../../../Domain/core/http-status.enum.js";
// Errors
import { UnauthorizedException401 } from "../../../Domain/core/errors.factory.js";

interface Dependences extends ControllersDependences {
  business: IAuthBusiness;
  authRequestDTO: IAuthRequestDTO;
}

export class AuthController implements IAuthController {
  readonly #name = this.constructor.name;
  readonly #business: IAuthBusiness;
  readonly #requestDTO: IAuthRequestDTO;
  readonly #sessionHandler: ISessionHandler;
  readonly #responseHandler: IResponseHandler;
  readonly #errorHandler: IErrorHandler;
  constructor(d: Readonly<Dependences>) {
    this.#responseHandler = d.responseHandler;
    this.#sessionHandler = d.sessionHandler;
    this.#business = d.business;
    this.#errorHandler = d.errorHandler;
    this.#requestDTO = d.authRequestDTO;
  }

  public readonly login: ControllerHandler<UserSessionDTO> = async (request) => {
    try {
      const { body } = await this.#requestDTO.login(request);
      const userDto = await this.#business.login(body);
      if (userDto === null) return this.#responseHandler.businessResponse({ error: new UnauthorizedException401("Username or password is incorrect") });
      userDto.session = await this.#sessionHandler.generateSession({ roles: userDto.roles, userUuid: userDto.uuid });
      return this.#responseHandler.businessResponse({ data: userDto.userSessionDTO });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#responseHandler.businessResponse({ error });
    }
  };

  public readonly register: ControllerHandler<UserNonSensitiveData> = async (request) => {
    try {
      const { body } = await this.#requestDTO.register(request);
      const userDto = await this.#business.register(body);
      return this.#responseHandler.businessResponse({ code: HttpStatus.CREATED, data: userDto.userNonSensitiveDTO });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#responseHandler.businessResponse({ error });
    }
  };

  public readonly activateAccount: ControllerHandler<boolean> = async (request) => {
    try {
      const { params } = await this.#requestDTO.activateAccount(request as unknown as ActivateAccountRequest);
      const validationString = await this.#business.activateAccount(params);
      return this.#responseHandler.businessResponse({ data: validationString });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#responseHandler.businessResponse({ error });
    }
  };

  public readonly forgotPassword: ControllerHandler<string> = async (request) => {
    try {
      const { body } = await this.#requestDTO.forgotPassword(request);
      const result = await this.#business.forgotPassword(body);
      return this.#responseHandler.businessResponse({ data: result });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#responseHandler.businessResponse({ error });
    }
  };

  public readonly changePassword: ControllerHandler<boolean> = async (request) => {
    try {
      const { body } = await this.#requestDTO.changePassword(request);
      const result = await this.#business.changePassword(body);
      return this.#responseHandler.businessResponse({ data: result });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#responseHandler.businessResponse({ error });
    }
  };
}
