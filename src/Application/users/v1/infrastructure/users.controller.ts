import { HttpStatus, BadRequestException400, NotFoundException404 } from "#Domain";
import { RoleName } from "../domain/role-name.enum.js";

import type { ILogger, ControllersDependencies, IErrorHandler, HttpResponse, ISessionHandler } from "#Domain";
import type { IUsersBusiness } from "../domain/IUsersBusiness";
import type { IUsersController } from "../domain/IUsersController";

interface Dependencies extends ControllersDependencies {
	business: IUsersBusiness;
}

export class UsersController implements IUsersController {
	readonly #name = this.constructor.name;
	readonly #response: HttpResponse;
	// readonly #bus: DomainEventBus;
	readonly #logger: ILogger;
	readonly #business: IUsersBusiness;
	readonly #sessionHandler: ISessionHandler;
	readonly #errorHandler: IErrorHandler;

	constructor(d: Readonly<Dependencies>) {
		this.#logger = d.logger;
		this.#response = d.responseHandler.http;
		// this.#bus = d.bus;
		this.#business = d.business;
		this.#sessionHandler = d.sessionHandler;
		this.#errorHandler = d.errorHandler;
	}

	public readonly postUser: IUsersController["postUser"] = async ({ headers, correlationId, body }) => {
		const { createUser } = this.#business;
		const { validateSession } = this.#sessionHandler;
		try {
			await validateSession(RoleName.ADMIN, headers.authorization);
			const { userNonSensitiveDTO } = await createUser(body);
			this.#logger.info("User created");
			return this.#response({ code: HttpStatus.CREATED, data: userNonSensitiveDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly getOneUser: IUsersController["getOneUser"] = async (p) => {
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

	public readonly getAllUsers: IUsersController["getAllUsers"] = async (p) => {
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

	public readonly patchUser: IUsersController["patchUser"] = async (p) => {
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

	public readonly deleteUser: IUsersController["deleteUser"] = async (p) => {
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

	public readonly createRole: IUsersController["createRole"] = async (p) => {
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

	public readonly rolesToUser: IUsersController["rolesToUser"] = async (p) => {
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
