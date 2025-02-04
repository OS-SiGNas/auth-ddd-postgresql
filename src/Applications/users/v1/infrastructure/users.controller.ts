import { HttpStatus } from "#Domain/business/http/http-status.enum.js";
import { UserNotFoundException } from "#Domain/core/errors.factory.js";
import { RoleName } from "../domain/role-name.enum.js";

import type { ILogger } from "#Domain/core/ILogger";
import type { ControllerHandler, ControllersDependences } from "#Domain/business/Business";
import type { IErrorHandler } from "#Domain/core/IErrorHandler";
import type { HttpResponse } from "#Domain/business/http/IResponseHandler.js";
import type { ISessionHandler } from "#Domain/business/sessions/ISessionHandler.js";
import type { UserNonSensitiveData } from "../domain/IUser.js";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
import type { IUsersController } from "../domain/IUsersController";
import type { IUsersRequestDTO } from "../domain/IUsersRequestDTO";
import type {
	AddUserRolesRequest,
	CreateUserRequest,
	CreateUserRoleRequest,
	DeleteUserRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
} from "../domain/Request.js";

interface Dependences extends ControllersDependences {
	userRequestDTO: IUsersRequestDTO;
	business: IUsersBusiness;
}

export class UsersController implements IUsersController {
	readonly #name = this.constructor.name;
	readonly #response: HttpResponse;
	readonly #logger: ILogger;
	readonly #business: IUsersBusiness;
	readonly #sessionHandler: ISessionHandler;
	readonly #requestDTO: IUsersRequestDTO;
	readonly #errorHandler: IErrorHandler;

	constructor(d: Readonly<Dependences>) {
		this.#logger = d.logger;
		this.#response = d.responseHandler.http;
		this.#business = d.business;
		this.#requestDTO = d.userRequestDTO;
		this.#sessionHandler = d.sessionHandler;
		this.#errorHandler = d.errorHandler;
	}

	public readonly postUser: ControllerHandler<UserNonSensitiveData> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const { body } = await this.#requestDTO.createUser(request as unknown as CreateUserRequest);
			const newUser = await this.#business.createUser(body);
			this.#logger.info("User created");
			return this.#response({ code: HttpStatus.CREATED, data: newUser.userNonSensitiveDTO });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly getOneUser: ControllerHandler<UserNonSensitiveData> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const { params } = await this.#requestDTO.getUser(request as unknown as GetOneUserRequest);
			const user = await this.#business.getOneUser(params);
			return this.#response({ data: user.userNonSensitiveDTO });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly getAllUsers: ControllerHandler<UserNonSensitiveData[]> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const payload = await this.#requestDTO.getAllUsers(request as unknown as GetAllUsersRequest);
			const users = await this.#business.getAllUsers(payload);
			return this.#response({ data: users });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly patchUser: ControllerHandler<string> = async (request) => {
		try {
			const { roles, userUuid } = await this.#sessionHandler.validateSession(RoleName.STANDARD, request.headers.authorization);
			const payload = await this.#requestDTO.updateUser(request as unknown as UpdateUserRequest);
			if (userUuid !== payload.params.uuid && !roles.includes(RoleName.ADMIN)) throw new UserNotFoundException(payload.params.uuid);
			const user = await this.#business.updateUser(payload);
			return user
				? this.#response({ data: `User ${payload.params.uuid} is updated` })
				: this.#response({ error: new UserNotFoundException(payload.params.uuid) });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly deleteUser: ControllerHandler<string> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const { params } = await this.#requestDTO.deleteUser(request as unknown as DeleteUserRequest);
			const deleted = await this.#business.deleteUser(params);
			return deleted ? this.#response({ data: `User ${params.uuid} deleted` }) : this.#response({ error: "" });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly createRole: ControllerHandler<string> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const { body } = await this.#requestDTO.createRole(request as unknown as CreateUserRoleRequest);
			await this.#business.createRole(body);
			return this.#response({ data: "Created", code: 201 });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};

	public readonly rolesToUser: ControllerHandler<UserNonSensitiveData> = async (request) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, request.headers.authorization);
			const payload = await this.#requestDTO.rolesToUser(request as unknown as AddUserRolesRequest);
			const user = await this.#business.rolesToUser(payload);
			return this.#response({ data: user.userNonSensitiveDTO });
		} catch (error) {
			this.#errorHandler.catch({
				name: this.#name,
				ticket: request.headers.uuid as string,
				error,
			});
			return this.#response({ error });
		}
	};
}
