import { HttpStatus } from "#Domain/response/http-status.enum.js";
import { Actions } from "#Domain/events/actions.enum.js";
import { DomainEvent } from "#Domain/events/domain-event.js";
// Errors
import { BadRequestException400, ForbiddenException403, UnauthorizedException401 } from "#Domain/errors/error.factory.js";

import type { Controller, ControllersDependencies } from "#Domain/Business.js";
import type { ILogger } from "#Domain/core/ILogger";
import type { IErrorHandler } from "#Domain/errors/IErrorHandler";
import type { HttpResponse } from "#Domain/response/IResponseHandler.js";
import type { ISessionHandler } from "#Domain/sessions/ISessionHandler.js";
import type { UserSessionDTO } from "#users/v1/domain/users.dto.js";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser";
import type { IAuthBusiness } from "../domain/IAuthBusiness";
import type { IAuthController } from "../domain/IAuthController";
import type {
	ActivateAccountRequest,
	ChangePasswordRequest,
	ForgotPasswordRequest,
	LoginRequest,
	RefreshTokenRequest,
	RegisterRequest,
} from "../domain/Request.js";

interface Dependencies extends ControllersDependencies {
	business: IAuthBusiness;
}

export class AuthController implements IAuthController {
	readonly #name = this.constructor.name;
	readonly #logger: ILogger;
	readonly #errorHandler: IErrorHandler;
	readonly #response: HttpResponse;
	readonly #sessionHandler: ISessionHandler;
	readonly #business: IAuthBusiness;
	constructor(d: Readonly<Dependencies>) {
		this.#logger = d.logger;
		this.#errorHandler = d.errorHandler;
		this.#response = d.responseHandler.http;
		this.#sessionHandler = d.sessionHandler;
		this.#business = d.business;
	}

	public readonly login: Controller<LoginRequest, UserSessionDTO> = async ({ body, correlationId }) => {
		try {
			const userDto = await this.#business.login(body);
			if (!userDto) return this.#response({ error: new UnauthorizedException401("Username or password is incorrect") });
			userDto.session = await this.#sessionHandler.generateSession({
				roles: userDto.roles,
				userUuid: userDto.uuid,
			});

			new DomainEvent<UserSessionDTO>({
				action: Actions.LOGIN,
				correlationId,
				moduleEmitter: this.#name,
				message: userDto.userSessionDTO,
			}).publish();

			return this.#response({ data: userDto.userSessionDTO });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly refreshToken: Controller<RefreshTokenRequest, string> = async ({ body, correlationId }) => {
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

	public readonly register: Controller<RegisterRequest, UserNonSensitiveData> = async ({ body, correlationId }) => {
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

	public readonly activateAccount: Controller<ActivateAccountRequest, string> = async ({ params, correlationId }) => {
		try {
			const user = await this.#business.activateAccount(params);
			if (user === undefined) return this.#response({ error: new BadRequestException400("Invalid activation request") });
			this.#logger.debug(`Account activated ${user.uuid}`);

			new DomainEvent<UserNonSensitiveData>({
				action: Actions.ACCOUNT_ACTIVATED,
				correlationId,
				moduleEmitter: this.constructor.name,
				context: {},
				message: user.userNonSensitiveDTO,
			}).publish();

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

	public readonly forgotPassword: Controller<ForgotPasswordRequest, string> = async ({ body, correlationId }) => {
		try {
			const result = await this.#business.forgotPassword(body);
			return this.#response({ data: result ? "Verification string sended" : "" });
		} catch (error) {
			return this.#response({
				error: this.#errorHandler.catch({ name: this.#name, ticket: correlationId, error }),
			});
		}
	};

	public readonly changePassword: Controller<ChangePasswordRequest, string> = async ({ body, correlationId }) => {
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
