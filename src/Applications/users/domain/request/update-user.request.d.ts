import { IUser } from "../IUser";

export interface UpdateUserRequest {
	query: object;
	params: { uuid: string };
	body: Partial<IUser>;
}
