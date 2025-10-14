export const Actions = {
	// system
	SYSTEM_SHUTDOWN: "system/shutdown",
	SYSTEM_REBOOT: "system/reboot",
	SYSTEM_BOOT: "system/boot",
	SYSTEM_LOG: "system/log",
	// notice
	NOTICE_NEW_YEAR: "notice/new-year",
	NOTICE_BIRTHDAY: "notice/birthday",
	NOTICE_CHRISMAS: "notice/chrismas",
	// Queue: rabbit, kafka, other
	QUEUE_CONSUME: "queue/consume",
	QUEUE_PUBLISH: "queue/publish",
	// Security Police
	POLICE_REMOVED_SESSION: "security/removed-session",
	POLICE_ACCESS_DENIED: "security/access-denied",
	POLICE_CAN_WRITE: "security/can_write",
	POLICE_CAN_READ: "security/can-read",
	// auth
	AUTH_EMAIL_ACTIVATE_ACCOUNT: "auth/email-activate-account",
	AUTH_EMAIL_FORGOT_PASSWORD: "auth/email-forgot-password",
	AUTH_ACCOUNT_PASSWORD_CHANGED: "auth/password-changed",
	AUTH_ACCOUNT_REGISTERED: "auth/account-registered",
	AUTH_ACCOUNT_ACTIVATED: "auth/account-activated",
	// AUTH_LOGIN: Symbol("auth/login"),
	AUTH_LOGIN: "auth/login",
	// users
	USERS_ACCOUNT_CREDENTIALS_MODIFIED: "users/account-creadendials-modified",
	USERS_ACCOUNT_DELETED: "users/account-deleted",
	USERS_ACCOUNT_CREATED: "users/account-created",
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
