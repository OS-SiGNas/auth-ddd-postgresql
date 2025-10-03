import { HttpStatus, BadRequestException400, NotFoundException404 } from "#Domain";
import { RoleName } from "../domain/role-name.enum.js";

import type { ILogger, ControllersDependencies, IErrorHandler, HttpResponse, ISessionHandler } from "#Domain";
import type { IUsersBusiness } from "../domain/IUsersBusiness.js";
import type { IUsersController } from "../domain/IUsersController.js";

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

	public readonly getAllUsers: IUsersController["getAllUsers"] = async ({ headers, query, correlationId: ticket }) => {
		const { try: $, catch: catcher } = this.#errorHandler;
		const { validateSession } = this.#sessionHandler;
		const { getAllUsers } = this.#business;

		const [sessionError] = await $(validateSession(RoleName.ADMIN, headers.authorization));
		if (sessionError !== null) return this.#response({ error: catcher({ name: this.#name, ticket, error: sessionError }) });
		const [error, data] = await $(getAllUsers(query));
		if (error !== null) return this.#response({ error: catcher({ name: this.#name, ticket, error }) });
		return this.#response({ data });
	};

	public readonly patchUser: IUsersController["patchUser"] = async (p) => {
		try {
			const { roles, userUuid } = await this.#sessionHandler.validateSession(RoleName.STANDARD, p.headers.authorization);
			if (userUuid !== p.params.uuid && !roles.includes(RoleName.ADMIN)) throw new NotFoundException404(p.params.uuid, { ticket: p.correlationId });
			const user = await this.#business.updateUser(p);
			return this.#response(
				user ? { data: `User ${p.params.uuid} is updated` } : { error: new NotFoundException404(p.params.uuid, { ticket: p.correlationId }) }
			);
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
