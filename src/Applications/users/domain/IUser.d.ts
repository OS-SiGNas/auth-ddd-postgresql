import { Role } from "./entities/roles.entity";

export interface IUser {
  uuid: string;
  createdAt: Date;
  isActive: boolean;
  name: string;
  email: string;
  password: string;
  roles: Role[];
}

export type UserNonSensitiveData = Pick<IUser, "uuid" | "email" | "roles" | "name" | "createdAt">;
