import { randomBytes } from "node:crypto";
import { UserDTO } from "../../users/domain/users.dto.js";
import { sendActivateAccountEmail } from "./notifications/email.notification.js";
// Errors
import { DuplicateAccountException, ForbiddenException403, UserNotFoundException } from "../../../Domain/core/errors.factory.js";

import type { Core } from "../../../Domain/core/Core.js";
import type { ILogger } from "../../../Domain/core/ILogger";
import type { BusinessHandler } from "../../../Domain/business/Business";
import type { IStorageHandler } from "../../../Domain/IStorageHandler";
import type { ITokenHandler } from "../../../Domain/business/ITokenHandler";
import type { IPasswordHandler } from "../../../Domain/business/IPasswordHandler";
import type { IAuthBusiness } from "../domain/IAuthBusiness.js";
import type { User } from "../../users/domain/entities/users.entity";
import type {
	LoginRequest,
	RegisterRequest,
	ActivateAccountRequest,
	ForgotPasswordRequest,
	ChangePasswordRequest,
} from "../domain/Request";

interface Dependences extends Core {
	repository: typeof User;
	logger: ILogger;
	passwordHandler: IPasswordHandler;
	activateAccountTokenHandler: ITokenHandler<{ email: string }>;
	storage: IStorageHandler;
}

export class AuthBusiness implements IAuthBusiness {
	readonly #repository: typeof User;
	readonly #logger: ILogger;
	readonly #passwordHandler: IPasswordHandler;
	readonly #activateAccountTokenHandler: ITokenHandler<{ email: string }>;
	readonly #storage: IStorageHandler;

	constructor(d: Readonly<Dependences>) {
		this.#repository = d.repository;
		this.#logger = d.logger;
		this.#passwordHandler = d.passwordHandler;
		this.#activateAccountTokenHandler = d.activateAccountTokenHandler;
		this.#storage = d.storage;
	}

	public readonly login: BusinessHandler<LoginRequest["body"], UserDTO | null> = async ({ email, password }) => {
		const [user] = await this.#repository.find({
			where: { email },
			relations: ["roles"],
			select: { roles: { name: true } },
		});

		if (user === undefined) return null;
		const isMatch = await this.#passwordHandler.comparePassword(password, user.password);
		if (isMatch === false) return null;
		if (user.isActive === false) return this.#activateAccount(email);
		return new UserDTO(user);
	};

	readonly #activateAccount = async (email: string): Promise<never> => {
		this.#storage.delete(email);
		const token = await this.#activateAccountTokenHandler.generateJWT({ email });
		this.#storage.set(email, token);
		void sendActivateAccountEmail({ emailReceiver: email, token });
		throw new ForbiddenException403("Inactive account, Please check your email for the activation link");
	};

	public readonly getUserByUuid: BusinessHandler<string, UserDTO> = async (uuid: string) => {
		const user = await this.#repository.findOne({ where: { uuid }, select: { roles: true } });
		if (user === null) throw new UserNotFoundException(uuid);
		this.#logger.debug(user);
		return new UserDTO(user);
	};

	public readonly register: BusinessHandler<RegisterRequest["body"], UserDTO> = async ({ email, name, password }) => {
		const exists = await this.#repository.exists({ where: { email } });
		if (exists) throw new DuplicateAccountException(email);
		const encryptedPassword = await this.#passwordHandler.encryptPassword(password);
		const schema = this.#repository.create({ email, name, password: encryptedPassword });
		const user = await this.#repository.save(schema);
		return new UserDTO(user);
	};

	public readonly activateAccount: BusinessHandler<ActivateAccountRequest["params"], boolean> = async ({ token }) => {
		const { email } = await this.#activateAccountTokenHandler.verifyJWT(token);
		this.#logger.info("Account activation attempt");
		const user = await this.#repository.findOneBy({ email });
		if (user === null) return false;
		const storedToken = await this.#storage.get<string>(user.email);
		if (storedToken === null) return false;
		if (storedToken !== token) return false;
		user.isActive = true;
		await this.#repository.save(user);
		return this.#storage.delete(user.email);
	};

	public readonly forgotPassword: BusinessHandler<ForgotPasswordRequest["body"], boolean> = async ({ email }) => {
		const user = await this.#repository.exists({ where: { email } });
		if (user === false) throw new UserNotFoundException(email);
		const verificationString = randomBytes(4).toString("hex");
		this.#logger.debug(`Verification string for ${email}: '${verificationString}'`);
		await this.#storage.set(email, { verificationString: await this.#passwordHandler.encryptPassword(verificationString) });
		return true;
	};

	public readonly changePassword: BusinessHandler<ChangePasswordRequest["body"], boolean> = async ({
		email,
		newPassword,
		verificationString,
	}) => {
		const storage = await this.#storage.get<{ verificationString: string }>(email);
		if (storage === null) return false;
		const isMatch = await this.#passwordHandler.comparePassword(verificationString, storage.verificationString);
		if (isMatch === false) return false;
		const { affected } = await this.#repository.update({ email }, { password: await this.#passwordHandler.encryptPassword(newPassword) });
		if (affected === undefined || affected !== 1) throw new UserNotFoundException(email);
		this.#storage.delete(email);
		return true;
	};
}
