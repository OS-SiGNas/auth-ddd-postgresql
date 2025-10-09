export const ACTIONS = {
	// system
	SYSTEM_BOOT: Symbol("system/boot"),
	SYSTEM_REBOOT: Symbol("system/reboot"),
	SYSTEM_SHUTDOWN: Symbol("system/shutdown"),
	SYSTEM_LOG: Symbol("system/log"),
	QUEUE_CONSUME: Symbol("queue/consume"),
	QUEUE_PUBLISH: Symbol("queue/publish"),

	// auth
	AUTH_LOGIN: Symbol("auth/login"),
	AUTH_ACCOUNT_REGISTERED: Symbol("auth/account-registered"),
	AUTH_ACCOUNT_ACTIVATED: Symbol("auth/account-activated"),
	AUTH_ACCOUNT_PASSWORD_CHANGED: Symbol("auth/password-changed"),
	AUTH_EMAIL_ACTIVATE_ACCOUNT: Symbol("auth/email-activate-account"),
	AUTH_EMAIL_FORGOT_PASSWORD: Symbol("auth/email-forgot-password"),

	// users
	USERS_ACCOUNT_CREATED: Symbol("users/account-created"),
	USERS_ACCOUNT_DELETED: Symbol("users/account-deleted"),
	USERS_ACCOUNT_CREDENTIALS_MODIFIED: Symbol("users/account-creadendials-modified"),
} as const;

/*
export const enum ACTIONS {
	// system
	SYSTEM_REBOOT = "system/reboot",
	SYSTEM_SHUTDOWN = "system/shutdown",
	SYSTEM_LOG = "system/log",

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
*/
