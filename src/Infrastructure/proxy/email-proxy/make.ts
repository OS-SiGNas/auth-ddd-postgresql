import { createTransport } from "nodemailer";
import { _EmailSenderProxy } from "./email-sender.proxy.js";
import { Logger } from "#shared/logger-handler/make.js";
import { IS_DEBUG } from "#Domain/config.js";

export const emailSender = _EmailSenderProxy.getInstance({
	IS_DEBUG,
	logger: new Logger("EmailSenderProxy"),
	transporter: createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for port 465, false for other ports
		auth: {
			user: "du43qp2aq7egqnps@ethereal.email",
			pass: "NecF31E1fgE4G378Vn",
		},
	}),
});
