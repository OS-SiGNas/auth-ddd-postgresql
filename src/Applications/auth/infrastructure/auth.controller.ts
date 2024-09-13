import { HttpStatus } from "../../../Domain/core/http-status.enum.js";

import type { ControllerHandler, ControllersDependences } from "../../../Domain/business/Business";
import type { ILogger } from "../../../Domain/core/ILogger";
import type { IErrorHandler } from "../../../Domain/core/IErrorHandler";
import type { HttpResponse } from "../../../Domain/business/IResponseHandler";
import type { ISessionHandler } from "../../../Domain/business/ISessionHandler";

import type { UserSessionDTO } from "../../users/domain/users.dto.js";
import type { IAuthRequestDTO } from "../../users/domain/IAuthRequestDTO";
import type { UserNonSensitiveData } from "../../users/domain/IUser";

import type { IAuthBusiness } from "../domain/IAuthBusiness";
import type { IAuthController } from "../domain/IAuthController";
import type { RefreshTokenRequest } from "../domain/request/refresh-token.request";
import type { AccountActivationRequest } from "../domain/request/account-activation.request";

// Errors
import { BadRequestException400, ForbiddenException403, UnauthorizedException401 } from "../../../Domain/core/errors.factory.js";

interface Dependences extends ControllersDependences {
	business: IAuthBusiness;
	authRequestDTO: IAuthRequestDTO;
}

export class AuthController implements IAuthController {
	readonly #name = this.constructor.name;
	readonly #logger: ILogger;
	readonly #errorHandler: IErrorHandler;
	readonly #response: HttpResponse;
	readonly #sessionHandler: ISessionHandler;
	readonly #business: IAuthBusiness;
	readonly #requestDTO: IAuthRequestDTO;
	constructor(d: Readonly<Dependences>) {
		this.#logger = d.logger;
		this.#errorHandler = d.errorHandler;
		this.#response = d.responseHandler.http;
		this.#sessionHandler = d.sessionHandler;

		this.#business = d.business;
		this.#requestDTO = d.authRequestDTO;
	}

	public readonly login: ControllerHandler<UserSessionDTO> = async (request) => {
		try {
			const { body } = await this.#requestDTO.login(request);
			const userDto = await this.#business.login(body);
			if (userDto === null) return this.#response({ error: new UnauthorizedException401("Username or password is incorrect") });
			userDto.session = await this.#sessionHandler.generateSession({ roles: userDto.roles, userUuid: userDto.uuid });
			return this.#response({ data: userDto.userSessionDTO });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};

	public readonly refreshToken: ControllerHandler<string> = async (request) => {
		this.#logger.info(`${request.hostname} refreshing token`);
		try {
			const { body } = await this.#requestDTO.refreshToken(request as unknown as RefreshTokenRequest);
			const { userUuid } = await this.#sessionHandler.validateRefreshToken(body.refreshToken);
			const user = await this.#business.getUserByUuid(userUuid);
			const accessToken = await this.#sessionHandler.generateAccessToken({ roles: user.roles, userUuid });
			return this.#response({ data: accessToken });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};

	public readonly register: ControllerHandler<UserNonSensitiveData> = async (request) => {
		try {
			const { body } = await this.#requestDTO.register(request);
			const userDto = await this.#business.register(body);
			return this.#response({ code: HttpStatus.CREATED, data: userDto.userNonSensitiveDTO });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};

	public readonly activateAccount: ControllerHandler<string> = async (request) => {
		try {
			const { body } = await this.#requestDTO.activateAccount(request);
			return (await this.#business.activateAccount(body))
				? this.#response({ data: "Url to activate account sent to email" })
				: this.#response({ error: new BadRequestException400("Can't acctivate this account") });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};

	public readonly accountActivation: ControllerHandler<string> = async (request) => {
		try {
			const { params } = await this.#requestDTO.accountActivation(request as unknown as AccountActivationRequest);
			const result = await this.#business.accountActivation(params);
			return result
				? this.#response({ data: "Account activated" })
				: this.#response({ error: new BadRequestException400("Invalid activation request") });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			if (error instanceof Error) {
				if (error.name === "TokenExpiredError") return this.#response({ error: new ForbiddenException403("Acctivation token expired") });
				if (error.name === "invalid signature" || error.name === "JsonWebTokenError")
					return this.#response({ error: new BadRequestException400("Invalid activation request") });
			}
			return this.#response({ error });
		}
	};

	public readonly forgotPassword: ControllerHandler<string> = async (request) => {
		try {
			const { body } = await this.#requestDTO.forgotPassword(request);
			const result = await this.#business.forgotPassword(body);
			return this.#response({ data: result ? "Verification string sended" : "" });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};

	public readonly changePassword: ControllerHandler<string> = async (request) => {
		try {
			const { body } = await this.#requestDTO.changePassword(request);
			const result = await this.#business.changePassword(body);
			return this.#response({ data: result ? "Password updated" : "Can't change password, try latter" });
		} catch (error) {
			this.#errorHandler.catch(this.#name, error);
			return this.#response({ error });
		}
	};
}
