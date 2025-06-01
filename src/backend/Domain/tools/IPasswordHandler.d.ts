export interface IPasswordHandler {
	encryptPassword: (password: string) => Promise<string>;
	comparePassword: (password: string, storagePassword: string) => Promise<boolean>;
}
