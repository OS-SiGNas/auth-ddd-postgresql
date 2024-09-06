export interface ITokenHandler {
  readonly generateJWT: <T extends object>(payload: T) => Promise<string>;
  readonly verifyJWT: <T>(token: string) => Promise<T>;
}
