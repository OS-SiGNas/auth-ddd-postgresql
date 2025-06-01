import type { Role } from "./entities/roles.entity";

export interface IUser {
	id: number;
	uuid: string;
	createdAt: Date;
	isActive: boolean;
	name: string;
	email: string;
	password: string;
	roles: Role[];
}

export interface UserNonSensitiveData {
	uuid: string;
	createdAt: Date;
	name: string;
	email: string;
	roles: string[];
}
