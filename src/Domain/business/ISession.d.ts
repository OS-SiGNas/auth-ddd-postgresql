import type { JwtPayload } from "jsonwebtoken";
import type { Role } from "../../Applications/users/domain/entities/roles.entity.ts";

interface ITokenPayload extends JwtPayload {
  readonly userUuid: string;
  readonly roles: Role[];
}

export interface ISession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessTokenExpiresIn: number;
  readonly refreshTokenExpiresIn: number;
}
