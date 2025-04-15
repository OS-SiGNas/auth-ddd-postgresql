import { randomBytes } from "node:crypto";
import { BadRequestException400, DuplicateAccountException409, ForbiddenException403, NotFoundException404 } from "#Domain/errors/error.factory.js";
import { UserDTO } from "#users/v1/domain/users.dto.js";
import { sendActivateAccountEmail } from "./notifications/email.notification.js";

import type { Core } from "#Domain/core/Core.js";
import type { ILogger } from "#Domain/core/ILogger";
import type { Business } from "#Domain/Business.js";
import type { ICacheHandler } from "#Domain/tools/ICacheHandler.js";
import type { ITokenHandler } from "#Domain/tools/ITokenHandler.js";
import type { IPasswordHandler } from "#Domain/tools/IPasswordHandler.js";
import type { User } from "#users/v1/domain/entities/users.entity";
import type { IAuthBusiness } from "../domain/IAuthBusiness.js";
import type { LoginRequest, RegisterRequest, ActivateAccountRequest, ForgotPasswordRequest, ChangePasswordRequest } from "../domain/Request";

interface Dependencies extends Core {
	repository: typeof User;
	logger: ILogger;
	passwordHandler: IPasswordHandler;
	activateAccountTokenHandler: ITokenHandler<{ email: string }>;
	storage: ICacheHandler;
}

export class AuthBusiness implements IAuthBusiness {
	readonly #repository: typeof User;
	readonly #logger: ILogger;
	readonly #passwordHandler: IPasswordHandler;
	readonly #activateAccountTokenHandler: ITokenHandler<{ email: string }>;
	readonly #storage: ICacheHandler;

	constructor(d: Readonly<Dependencies>) {
		this.#repository = d.repository;
		this.#logger = d.logger;
		this.#passwordHandler = d.passwordHandler;
		this.#activateAccountTokenHandler = d.activateAccountTokenHandler;
		this.#storage = d.storage;
	}

	public readonly register: Business<RegisterRequest["body"], UserDTO> = async ({ email, name, password }) => {
		const exists = await this.#repository.exists({ where: { email } });
		if (exists) throw new DuplicateAccountException409(email);
		const encryptedPassword = await this.#passwordHandler.encryptPassword(password);
		const schema = this.#repository.create({ email, name, password: encryptedPassword });
		const user = await this.#repository.save(schema);
		return new UserDTO(user);
	};

	public readonly login: Business<LoginRequest["body"], UserDTO | null> = async ({ email, password }) => {
		const [user] = await this.#repository.find({
			where: { email },
			relations: ["roles"],
			select: { roles: { name: true } },
		});
		if (user === undefined) return null;
		const isMatch = await this.#passwordHandler.comparePassword(password, user.password);
		if (!isMatch) return null;
		if (!user.isActive) return this.#inactiveAccountFlow(email);
		return new UserDTO(user);
	};

	readonly #inactiveAccountFlow = async (email: string): Promise<never> => {
		await this.#storage.delete(email);
		const token = await this.#activateAccountTokenHandler.generateJWT({ email });
		this.#storage.set(email, token);
		void sendActivateAccountEmail({ emailReceiver: email, token });
		throw new ForbiddenException403("Inactive account, Please check your email for the activation link");
	};

	public readonly getUserByUuid: Business<string, UserDTO> = async (uuid: string) => {
		const user = await this.#repository.findOne({ where: { uuid }, select: { roles: true } });
		if (user === null) throw new NotFoundException404(uuid);
		return new UserDTO(user);
	};

	public readonly activateAccount: Business<ActivateAccountRequest["params"], UserDTO> = async ({ token }) => {
		const { email } = await this.#activateAccountTokenHandler.verifyJWT(token);
		this.#logger.info("Account activation attempt");
		const user = await this.#repository.findOneBy({ email });
		if (user === null) throw new BadRequestException400("Invalid token");
		const storedToken = await this.#storage.get<string>(user.email);
		if (storedToken === null || storedToken !== token) throw new BadRequestException400("Invalid token");
		user.isActive = true;
		await this.#repository.save(user);
		await this.#storage.delete(user.email);
		return new UserDTO(user);
	};

	public readonly forgotPassword: Business<ForgotPasswordRequest["body"], boolean> = async ({ email }) => {
		const user = await this.#repository.exists({ where: { email } });
		if (user === false) throw new NotFoundException404(email);
		const verificationString = randomBytes(4).toString("hex");
		this.#logger.debug(`Verification string for ${email}: '${verificationString}'`);
		await this.#storage.set(email, { verificationString: await this.#passwordHandler.encryptPassword(verificationString) });
		return true;
	};

	public readonly changePassword: Business<ChangePasswordRequest["body"], boolean> = async ({ email, newPassword, verificationString }) => {
		const storage = await this.#storage.get<{ verificationString: string }>(email);
		if (storage === null) return false;
		const isMatch = await this.#passwordHandler.comparePassword(verificationString, storage.verificationString);
		if (isMatch === false) return false;
		const { affected } = await this.#repository.update({ email }, { password: await this.#passwordHandler.encryptPassword(newPassword) });
		if (affected === undefined || affected !== 1) throw new NotFoundException404(email);
		await this.#storage.delete(email);
		return true;
	};
}
