import { randomBytes } from "node:crypto";
import { BadRequestException400, DuplicateAccountException409, ForbiddenException403, NotFoundException404 } from "#Domain";
import { UserDTO } from "#users/v1/domain/users.dto.js";
import { sendActivateAccountEmail } from "./notifications/email.notification.js";
import type { Core, ICacheHandler, ILogger, IPasswordHandler, ITokenHandler } from "#Domain";
import type { User } from "#users/v1/domain/entities/users.entity";
import type { IAuthBusiness } from "../domain/IAuthBusiness.js";

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

	public readonly register: IAuthBusiness["register"] = async ({ email, name, password }) => {
		const exists = await this.#repository.exists({ where: { email } });
		if (exists) throw new DuplicateAccountException409(email);
		const encryptedPassword = await this.#passwordHandler.encryptPassword(password);
		const schema = this.#repository.create({ email, name, password: encryptedPassword });
		const user = await this.#repository.save(schema);
		return new UserDTO(user);
	};

	public readonly login: IAuthBusiness["login"] = async ({ email, password }) => {
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

	public readonly getUserByUuid: IAuthBusiness["getUserByUuid"] = async (uuid: string) => {
		const user = await this.#repository.findOne({ where: { uuid }, select: { roles: true } });
		if (user === null) throw new NotFoundException404(uuid);
		return new UserDTO(user);
	};

	public readonly activateAccount: IAuthBusiness["activateAccount"] = async ({ token }) => {
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

	public readonly forgotPassword: IAuthBusiness["forgotPassword"] = async ({ email }) => {
		const user = await this.#repository.exists({ where: { email } });
		if (user === false) throw new NotFoundException404(email);
		const verificationString = randomBytes(4).toString("hex");
		this.#logger.debug(`Verification string for ${email}: '${verificationString}'`);
		await this.#storage.set(email, { verificationString: await this.#passwordHandler.encryptPassword(verificationString) });
		return true;
	};

	public readonly changePassword: IAuthBusiness["changePassword"] = async ({ email, newPassword, verificationString }) => {
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
