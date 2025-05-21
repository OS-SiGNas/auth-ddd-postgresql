import type { Transporter } from "nodemailer";
import type { Core, ILogger } from "#Domain";

interface EmailMessage {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

interface Dependencies extends Core {
	transporter: Transporter;
}

type GetInstance = (d: Dependencies) => Readonly<_EmailSenderProxy>;

export class _EmailSenderProxy {
	static #instance: _EmailSenderProxy;
	static getInstance: GetInstance = (d) => (this.#instance ??= new _EmailSenderProxy(d));

	readonly #isDebug: boolean;
	readonly #logger: ILogger;
	readonly #transporter: Transporter;
	private constructor(d: Dependencies) {
		this.#transporter = d.transporter;
		this.#logger = d.logger;
		this.#isDebug = d.DEBUG;
	}

	public readonly sendEmail = async (msg: EmailMessage): Promise<void> => {
		const info = await this.#transporter.sendMail(msg).catch((error) => this.#logger.error(this.constructor.name, error));
		if (this.#isDebug && info !== undefined) {
			const { getTestMessageUrl } = await import("nodemailer");
			const url = getTestMessageUrl(info);
			this.#logger.info(`Link for email message: ${url}`);
		}
	};
}
