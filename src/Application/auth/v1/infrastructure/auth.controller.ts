import { HttpStatus, BadRequestException400, ForbiddenException403, UnauthorizedException401 } from "#Domain";

import type { ControllersDependencies, HttpResponse, IErrorHandler, ILogger, ISessionHandler } from "#Domain";
// import type { UserSessionDTO } from "#users/v1/domain/users.dto.js";
// import type { UserNonSensitiveData } from "#users/v1/domain/IUser";

import type { IAuthBusiness } from "../domain/IAuthBusiness";
import type { IAuthController } from "../domain/IAuthController";

interface Dependencies extends ControllersDependencies {
	business: IAuthBusiness;
}

export class AuthController implements IAuthController {
	readonly #name = this.constructor.name;
	readonly #response: HttpResponse;
	readonly #sessionHandler: ISessionHandler;
	// readonly #bus: DomainEventBus;
	readonly #logger: ILogger;
	readonly #errorHandler: IErrorHandler;

	readonly #business: IAuthBusiness;
	constructor(d: Readonly<Dependencies>) {
		this.#business = d.business;
		this.#response = d.responseHandler.http;
		// this.#bus = d.bus;
		this.#logger = d.logger;
		this.#sessionHandler = d.sessionHandler;
		this.#errorHandler = d.errorHandler;
	}

	public readonly login: IAuthController["login"] = async ({ body, correlationId }) => {
		try {
			const userDto = await this.#business.login(body);
			if (!userDto) return this.#response({ error: new UnauthorizedException401("Username or password is incorrect") });
			userDto.session = await this.#sessionHandler.generateSession({
				roles: userDto.roles,
				userUuid: userDto.uuid,
			});

			// TODO: emit event in bus

			return this.#response({ data: userDto.userSessionDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly refreshToken: IAuthController["refreshToken"] = async ({ body, correlationId }) => {
		try {
			const { userUuid } = await this.#sessionHandler.validateRefreshToken(body.refreshToken);
			const user = await this.#business.getUserByUuid(userUuid);
			const accessToken = await this.#sessionHandler.generateAccessToken({ roles: user.roles, userUuid });
			return this.#response({ data: accessToken });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly register: IAuthController["register"] = async ({ body, correlationId }) => {
		try {
			const userDto = await this.#business.register(body);
			return this.#response({
				code: HttpStatus.CREATED,
				data: userDto.userNonSensitiveDTO,
			});
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly activateAccount: IAuthController["activateAccount"] = async ({ params, correlationId }) => {
		try {
			const user = await this.#business.activateAccount(params);
			if (user === undefined) return this.#response({ error: new BadRequestException400("Invalid activation request") });
			this.#logger.debug(`Account activated ${user.uuid}`);

			// TODO: emit event in bus

			return this.#response({ data: "Account activated" });
		} catch (error) {
			if (error instanceof Error) {
				const isInvalidToken = error.name === "invalid signature" || error.name === "JsonWebTokenError";
				const isTokenExpired = error.name === "TokenExpiredError";
				if (isInvalidToken) return this.#response({ error: new BadRequestException400("Invalid activation request") });
				if (isTokenExpired) return this.#response({ error: new ForbiddenException403("Acctivation token expired") });
			}
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly forgotPassword: IAuthController["forgotPassword"] = async ({ body, correlationId }) => {
		try {
			const result = await this.#business.forgotPassword(body);
			return this.#response({ data: result ? "Verification string sended" : "" });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly changePassword: IAuthController["changePassword"] = async ({ body, correlationId }) => {
		try {
			const result = await this.#business.changePassword(body);
			return result ? this.#response({ data: "Password updated" }) : this.#response({ error: new BadRequestException400("Invalid password change") });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};
}
