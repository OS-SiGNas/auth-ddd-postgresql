import type { Transporter, SentMessageInfo } from "nodemailer";
import { type ILogger } from "#Domain";

export interface EmailMessage {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

interface Dependencies {
	transporter: Transporter;
	logger: ILogger;
	DEBUG: boolean;
}

export interface EmailSender {
	readonly sendEmail: (email: EmailMessage) => Promise<void>;
}

type GetInstance = (d: Dependencies) => Readonly<_EmailSenderProxy>;

export class _EmailSenderProxy implements EmailSender {
	static #instance: _EmailSenderProxy;
	static getInstance: GetInstance = (d) => (this.#instance ??= new _EmailSenderProxy(d));

	readonly #isDebug: boolean;
	readonly #logger: ILogger;
	readonly #transporter: Transporter;
	// readonly #eventHandler: EventHandler;
	private constructor(d: Dependencies) {
		this.#transporter = d.transporter;
		this.#logger = d.logger;
		this.#isDebug = d.DEBUG;
		// this.#eventHandler = { bus: d.bus, eventFactory: d.eventFactory };
	}

	public readonly sendEmail: EmailSender["sendEmail"] = async (email) => {
		try {
			const info: SentMessageInfo = await this.#transporter.sendMail(email);
			if (info === undefined) return;
			this.#logger.info("sended to: ", email.to);

			/*
			const action = ACTIONS.EMAIL_SENDED
			const event = this.#eventHandler.eventFactory({
				metadata: { action, correlationId: "", moduleEmitter: this.constructor.name },
				context: null,
				message: email,
			});

			this.#eventHandler.bus.emit(action, event) */

			if (this.#isDebug) {
				const { getTestMessageUrl } = await import("nodemailer");
				const url = getTestMessageUrl(info);
				this.#logger.info(`Link for email message: ${url}`);
			}
		} catch (error) {
			this.#logger.error(`error when sendind to: ${email.to}`, error);
		}
	};
}
