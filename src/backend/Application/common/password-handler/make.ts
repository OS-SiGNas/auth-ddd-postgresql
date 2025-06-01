import bcrypt from "bcryptjs";

import { _PasswordHandler } from "./_password.handler.js";

export const passwordHandler = _PasswordHandler.getInstance({
	genSalt: bcrypt.genSalt,
	hash: bcrypt.hash,
	compare: bcrypt.compare,
});
