import { ModuleException, type EventMap, type ILogger } from "#Domain";
import type { EmailSender, EmailMessage } from "#Infrastructure/proxy/email-proxy/email-sender.proxy";

type SendActivateAccountEmail = (...args: EventMap["auth/email-activate-account"]) => Promise<void>;
type SendForgotPasswordEmail = (...arsg: EventMap["auth/email-forgot-password"]) => Promise<void>;

interface Dependencies {
	/**
	application domain host */
	url: string;

	emailSender: EmailSender;
	logger: ILogger;
}

export class AuthEmailSubscribers {
	readonly #sendEmail: EmailSender["sendEmail"];
	readonly #logger: ILogger;
	readonly #url: string;

	constructor(d: Dependencies) {
		this.#url = d.url;
		this.#sendEmail = d.emailSender.sendEmail;
		this.#logger = d.logger;
	}

	public readonly sendActivateAccountEmail: SendActivateAccountEmail = async ({ metadata: { id }, context, message }) => {
		if (context !== null) throw new ModuleException("Unhandled event context");

		const email: EmailMessage = {
			from: "signas13@gmail.com",
			subject: "Activate Account",
			to: message.emailReceiver,
			html: `<a href="${this.#url}/auth/activate-account/${message.token}"> ACTIVATE ACCOUNT </a>`,
		};

		await this.#sendEmail(email).then(() => this.#logger.info(`Success event: ${id}`));
	};

	public readonly sendForgotPasswordEmail: SendForgotPasswordEmail = async ({ metadata: { id }, context, message }) => {
		if (context !== null) throw new ModuleException("Unhandled event context");

		const email: EmailMessage = {
			from: "signas13@gmail.com",
			subject: "Forgot Password",
			to: message.emailReceiver,
			text: message.hash,
		};

		await this.#sendEmail(email).then(() => this.#logger.info(`Success event: ${id}`));
	};
}
