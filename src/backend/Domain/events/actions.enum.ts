export const enum ACTIONS {
	// system
	SYSTEM_REBOOT = "system/reboot",
	SYSTEM_SHUTDOWN = "system/shutdown",

	// Queue
	QUEUE_CONSUME = "queue/consume",
	QUEUE_PUBLISH = "queue/publish",

	// auth
	AUTH_LOGIN = "auth/login",
	AUTH_ACCOUNT_REGISTERED = "auth/account-registered",
	AUTH_ACCOUNT_ACTIVATED = "auth/account-activated",
	AUTH_ACCOUNT_PASSWORD_CHANGED = "auth/password-changed",
	AUTH_EMAIL_ACTIVATE_ACCOUNT = "auth/email-activate-account",
	AUTH_EMAIL_FORGOT_PASSWORD = "auth/email-forgot-password",

	// users
	USERS_ACCOUNT_CREATED = "users/account-created",
	USERS_ACCOUNT_DELETED = "users/account-deleted",
	USERS_ACCOUNT_CREDENTIALS_MODIFIED = "users/account-creadendials-modified",
}
