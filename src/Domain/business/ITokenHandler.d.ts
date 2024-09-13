export interface ITokenHandler<Payload extends object> {
	readonly generateJWT: (payload: Payload) => Promise<string>;
	readonly verifyJWT: (token: string) => Promise<Payload>;
}
