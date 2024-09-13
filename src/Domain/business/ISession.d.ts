import type { JwtPayload } from "jsonwebtoken";
import type { RoleName } from "../../Applications/users/domain/role-name.enum.js";

interface ITokenPayload extends JwtPayload {
	readonly userUuid: string;
	readonly roles: RoleName[];
}

export interface ISession {
	readonly accessToken: string;
	readonly refreshToken: string;
}
