import type { ITokenHandler } from "#Domain/tools/ITokenHandler";

export const mockActivateAccountTokenHandler: ITokenHandler<{ email: string }> = {
	generateJWT: function (payload: { email: string }): Promise<string> {
		throw new Error("Function not implemented.");
	},
	verifyJWT: function (token: string): Promise<{ email: string }> {
		throw new Error("Function not implemented.");
	},
};
