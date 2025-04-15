import { HttpStatus } from "#Domain/response/http-status.enum.js";
import { BadRequestException400, NotFoundException404 } from "#Domain/errors/error.factory.js";
import { RoleName } from "../domain/role-name.enum.js";

import type { ILogger } from "#Domain/core/ILogger";
import type { Controller, ControllersDependencies } from "#Domain/Business";
import type { IErrorHandler } from "#Domain/errors/IErrorHandler";
import type { HttpResponse } from "#Domain/response/IResponseHandler.js";
import type { ISessionHandler } from "#Domain/sessions/ISessionHandler.js";
import type { UserNonSensitiveData } from "../domain/IUser.js";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
import type { IUsersController } from "../domain/IUsersController";
import type {
	AddUserRolesRequest,
	CreateUserRequest,
	CreateUserRoleRequest,
	DeleteUserRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
} from "../domain/Request.js";

interface Dependencies extends ControllersDependencies {
	business: IUsersBusiness;
}

export class UsersController implements IUsersController {
	readonly #name = this.constructor.name;
	readonly #response: HttpResponse;
	readonly #logger: ILogger;
	readonly #business: IUsersBusiness;
	readonly #sessionHandler: ISessionHandler;
	readonly #errorHandler: IErrorHandler;

	constructor(d: Readonly<Dependencies>) {
		this.#logger = d.logger;
		this.#response = d.responseHandler.http;
		this.#business = d.business;
		this.#sessionHandler = d.sessionHandler;
		this.#errorHandler = d.errorHandler;
	}

	public readonly postUser: Controller<CreateUserRequest, UserNonSensitiveData> = async ({ headers, correlationId, body }) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, headers.authorization);
			const newUser = await this.#business.createUser(body);
			this.#logger.info("User created");
			return this.#response({ code: HttpStatus.CREATED, data: newUser.userNonSensitiveDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly getOneUser: Controller<GetOneUserRequest, UserNonSensitiveData> = async (p) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, p.headers.authorization);
			const user = await this.#business.getOneUser(p.params);
			return this.#response({ data: user.userNonSensitiveDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};

	public readonly getAllUsers: Controller<GetAllUsersRequest, UserNonSensitiveData[]> = async (p) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, p.headers.authorization);
			const users = await this.#business.getAllUsers(p);
			return this.#response({ data: users });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};

	public readonly patchUser: Controller<UpdateUserRequest, string> = async (p) => {
		try {
			const { roles, userUuid } = await this.#sessionHandler.validateSession(RoleName.STANDARD, p.headers.authorization);
			if (userUuid !== p.params.uuid && !roles.includes(RoleName.ADMIN)) throw new NotFoundException404(p.params.uuid);
			const user = await this.#business.updateUser(p);
			return user ? this.#response({ data: `User ${p.params.uuid} is updated` }) : this.#response({ error: new NotFoundException404(p.params.uuid) });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};

	public readonly deleteUser: Controller<DeleteUserRequest, string> = async (p) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, p.headers.authorization);
			const deleted = await this.#business.deleteUser(p.params);
			return deleted
				? this.#response({ data: `User ${p.params.uuid} deleted` })
				: this.#response({ error: new BadRequestException400("It was not possible to delete this resource") });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};

	public readonly createRole: Controller<CreateUserRoleRequest, string> = async (p) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, p.headers.authorization);
			await this.#business.createRole(p.body);
			return this.#response({ data: "Created", code: 201 });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};

	public readonly rolesToUser: Controller<AddUserRolesRequest, UserNonSensitiveData> = async (p) => {
		try {
			await this.#sessionHandler.validateSession(RoleName.ADMIN, p.headers.authorization);
			const user = await this.#business.rolesToUser(p);
			return this.#response({ data: user.userNonSensitiveDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: p.correlationId, error }),
			});
		}
	};
}
