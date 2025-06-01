import type { AuthBusinessCli } from "../application/auth.business-cli";
import type { UsersBusinessCli } from "../application/users.business-cli";

export interface Cli {
	auth: AuthBusinessCli;
	users: UsersBusinessCli;
}

export type CreateCli = (args: { url: string; timeout: number; debug: boolean }) => Cli;
