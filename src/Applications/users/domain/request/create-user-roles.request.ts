import type { RoleName } from "../role-name.enum";

export interface CreateUserRoleRequest {
	params: object;
	query: object;
	body: { name: RoleName };
}
