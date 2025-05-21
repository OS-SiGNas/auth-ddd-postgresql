import { createTransport } from "nodemailer";
import { DEBUG } from "#Config";
import { _EmailSenderProxy } from "./email-sender.proxy.js";
import { Logger } from "#common/logger-handler/make.js";

export const emailSender = _EmailSenderProxy.getInstance({
	DEBUG,
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
