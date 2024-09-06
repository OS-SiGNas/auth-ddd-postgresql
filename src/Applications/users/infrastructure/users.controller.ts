import type { ControllerHandler, ControllersDependences } from "../../../Domain/business/Business";
import type { IErrorHandler } from "../../../Domain/core/IErrorHandler";
import type { IResponseHandler } from "../../../Domain/business/IResponseHandler";
// import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";
import type { UserNonSensitiveData } from "../domain/IUser";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
import type { IUsersController } from "../domain/IUsersController";
import type { IUsersRequestDTO } from "../domain/IUsersRequestDTO";
import type { DeleteUserRequest } from "../domain/request/delete-user.request";
import type { GetOneUserRequest } from "../domain/request/get-one-user.request";
import type { UpdateUserRequest } from "../domain/request/update-user.request";

import { HttpStatus } from "../../../Domain/core/http-status.enum.js";
// Error
import { BadRequestException400, UserNotFoundException } from "../../../Domain/core/errors.factory.js";
import { AddUserRolesRequest } from "../domain/request/add-user-role.request";

interface Dependences extends ControllersDependences {
  userRequestDTO: IUsersRequestDTO;
  business: IUsersBusiness;
}

export class UsersController implements IUsersController {
  readonly #name: string;
  readonly #response: IResponseHandler;
  readonly #business: IUsersBusiness;
  // readonly #sessionHandler: ISessionHandler;
  readonly #requestDTO: IUsersRequestDTO;
  readonly #errorHandler: IErrorHandler;

  constructor(d: Readonly<Dependences>) {
    this.#name = d.name;
    this.#response = d.responseHandler;
    this.#business = d.business;
    this.#requestDTO = d.userRequestDTO;
    // this.#sessionHandler = d.sessionHandler;
    this.#errorHandler = d.errorHandler;
  }

  public readonly postUser: ControllerHandler<UserNonSensitiveData> = async (request) => {
    try {
      // const session = await this.#sessionHandler.validateSession("admin", request.headers.authorization);
      // if (session === undefined) throw new ForbiddenError403("Forbidden Access");
      console.log(request.body);
      const { body } = await this.#requestDTO.createUser(request);
      const newUser = await this.#business.createUser(body);
      return this.#response.businessResponse({ code: HttpStatus.CREATED, data: newUser.userNonSensitiveDTO });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly getUser: ControllerHandler<UserNonSensitiveData> = async (request) => {
    try {
      // const session = await this.#sessionHandler.validateSession("admin", request.headers.authorization);
      // if (session === undefined) throw new ForbiddenError403("Forbidden Access");

      const { params } = await this.#requestDTO.getUser(request as unknown as GetOneUserRequest);
      const user = await this.#business.getOneUser(params);
      if (user === null) return this.#response.businessResponse({ code: HttpStatus.NOT_FOUND, error: new UserNotFoundException(params.uuid) });
      return this.#response.businessResponse({ data: user.userNonSensitiveDTO });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly getAllUsers: ControllerHandler<UserNonSensitiveData[]> = async (request) => {
    try {
      // const session = await this.#sessionHandler.validateSession("admin", request.headers.authorization);
      // if (session === undefined) throw new ForbiddenError403("Forbidden Access");

      const payload = await this.#requestDTO.getAllUsers(request as unknown as GetOneUserRequest);
      const users = await this.#business.getAllUsers(payload);
      if (users === undefined || users.length === 0) throw new BadRequestException400("Cant get users");
      return this.#response.businessResponse({ code: HttpStatus.OK, data: users });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly patchUser: ControllerHandler<string> = async (request) => {
    try {
      // const session = await this.#sessionHandler.validateSession("admin", request.headers.authorization);
      // if (session === undefined) throw new ForbiddenError403("Forbidden Access");

      const payload = await this.#requestDTO.updateUser(request as unknown as UpdateUserRequest);
      const user = await this.#business.updateUser(payload);
      if (user === false) throw new BadRequestException400("Can't update user: " + request.params.uuid);
      return this.#response.businessResponse({ data: `User ${request.params.uuid} is updated` });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly createRole: ControllerHandler<string> = async (request) => {
    try {
      const { body } = await this.#requestDTO.createRole(request);
      await this.#business.createRole(body);
      return this.#response.businessResponse({ data: "Created", code: 201 });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly addUserRole: ControllerHandler<UserNonSensitiveData> = async (request) => {
    try {
      const payload = await this.#requestDTO.addUserRoles(request as unknown as AddUserRolesRequest);
      const user = await this.#business.addUserRole(payload);
      return this.#response.businessResponse({ data: user.userNonSensitiveDTO });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };

  public readonly deleteUser: ControllerHandler<string> = async (request) => {
    try {
      // const session = await this.#sessionHandler.validateSession("admin", request.headers.authorization);
      // if (session === undefined) throw new ForbiddenError403("Forbidden Access");

      const { params } = await this.#requestDTO.deleteUser(request as unknown as DeleteUserRequest);
      const deleted = await this.#business.deleteUser(params);
      if (deleted === false) throw new BadRequestException400(`Can't delete user ${request.params.uuid}`);
      return this.#response.businessResponse({ code: HttpStatus.OK, data: `User ${request.params.uuid}` });
    } catch (error) {
      this.#errorHandler.catch(this.#name, error);
      return this.#response.businessResponse({ error });
    }
  };
}
