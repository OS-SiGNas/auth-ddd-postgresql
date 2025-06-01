import type { CreateCli } from "./domain/Cli.js";

import { HttpProxy } from "./infrastructure/http.proxy.js";
import { AuthBusinessCli } from "./application/auth.business-cli.js";
import { UsersBusinessCli } from "./application/users.business-cli.js";

export const createCli: CreateCli = ({ url, timeout, debug }) => {
	const http = new HttpProxy({ url, debug, timeout });

	const auth = new AuthBusinessCli(http);
	const users = new UsersBusinessCli(http);

	return { auth, users };
};
