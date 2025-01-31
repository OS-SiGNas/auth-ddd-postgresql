import { createTransport } from "nodemailer";
import { _EmailSenderProxy } from "./email-sender.proxy.js";
import { Logger } from "#shared/logger-handler/make.js";
import { DEBUG_MODE } from "#Config";

export const emailSender = _EmailSenderProxy.getInstance({
	DEBUG_MODE,
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
