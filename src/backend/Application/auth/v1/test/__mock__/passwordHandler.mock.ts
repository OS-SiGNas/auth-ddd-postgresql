import type { IPasswordHandler } from "#Domain";

export const mockPasswordHandler: IPasswordHandler = {
	comparePassword: async (password: string, storagePassword: string): Promise<boolean> => {
		return await Promise.resolve(password === storagePassword);
	},
	encryptPassword: async (password: string): Promise<string> => {
		return await Promise.resolve(password);
	},
};
