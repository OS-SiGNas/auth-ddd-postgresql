import { emailSender } from "#Infrastructure/proxy/email-proxy/make.js";
import { secrets } from "#Config";

interface EmailValitadeAccountArgs {
	token: string;
	emailReceiver: string;
}

export const sendActivateAccountEmail = ({ token, emailReceiver }: EmailValitadeAccountArgs): void => {
	void emailSender.sendEmail({
		from: "signas13@gmail.com",
		subject: "Activate Account",
		to: emailReceiver,
		html: `<a href="${secrets.THIS_URL}/auth/activate-account/${token}"> ACTIVATE ACCOUNT </a>`,
	});
};

interface ForgotPasswordEmailArgs {
	hash: string;
	emailReceiver: string;
}

export const sendForgotPasswordEmail = ({ hash, emailReceiver }: ForgotPasswordEmailArgs): void => {
	void emailSender.sendEmail({
		from: "signas13@gmail.com",
		subject: "Forgot Password",
		to: emailReceiver,
		text: hash,
	});
};
