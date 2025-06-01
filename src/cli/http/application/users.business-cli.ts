import { ENDPOINTS as USERS_ENDPOINTS } from "#users/v1/domain/endpoints.enum.js";

import type { IUsersController } from "#users/v1/domain/IUsersController.js";
import type { HttpProxyResponse, IHttpProxy } from "../domain/IHttpProxy.js";
import type {
	CreateUserRequest,
	CreateUserRoleRequest,
	GetAllUsersRequest,
	GetOneUserRequest,
	UpdateUserRequest,
	AddUserRolesRequest,
	DeleteUserRequest,
} from "#users/v1/domain/Request.js";
import type { UserNonSensitiveData } from "#users/v1/domain/IUser.js";

export class UsersBusinessCli implements Record<keyof IUsersController, unknown> {
	readonly #http: IHttpProxy;
	constructor(http: IHttpProxy) {
		this.#http = http;
	}

	public readonly getOneUser = async (params: GetOneUserRequest["params"], signal: AbortSignal): HttpProxyResponse<UserNonSensitiveData> => {
		const endpoint = USERS_ENDPOINTS.USERS_UUID.replace(":uuid", params.uuid);
		return await this.#http.get<UserNonSensitiveData>(endpoint, signal);
	};

	public readonly getAllUsers = async ({ offset, limit }: GetAllUsersRequest["query"], signal: AbortSignal): HttpProxyResponse<UserNonSensitiveData[]> => {
		const endpoint = `${USERS_ENDPOINTS.USERS}?limit=${limit}?offset=${offset}`;
		return await this.#http.get<UserNonSensitiveData[]>(endpoint, signal);
	};

	public readonly postUser = async (body: CreateUserRequest["body"], signal: AbortSignal): HttpProxyResponse<UserNonSensitiveData> => {
		return await this.#http.post<UserNonSensitiveData>(USERS_ENDPOINTS.USERS, body, signal);
	};

	public readonly patchUser = async (
		params: UpdateUserRequest["params"],
		body: UpdateUserRequest["body"],
		signal: AbortSignal
	): HttpProxyResponse<UserNonSensitiveData> => {
		const endpoint = USERS_ENDPOINTS.USERS_UUID.replace(":uuid", params.uuid);
		return await this.#http.patch<UserNonSensitiveData>(endpoint, body, signal);
	};

	public readonly createRole = async (body: CreateUserRoleRequest["body"], signal: AbortSignal): HttpProxyResponse<string> => {
		return await this.#http.post<string>(USERS_ENDPOINTS.CREATE_ROLE, body, signal);
	};

	public readonly rolesToUser = async (
		params: AddUserRolesRequest["params"],
		body: AddUserRolesRequest["body"],
		signal: AbortSignal
	): HttpProxyResponse<UserNonSensitiveData> => {
		const endpoint = USERS_ENDPOINTS.ROLES_TO_USER.replace(":uuid", params.uuid);
		return await this.#http.patch<UserNonSensitiveData>(endpoint, body, signal);
	};

	public readonly deleteUser = async (params: DeleteUserRequest["params"], signal: AbortSignal): HttpProxyResponse<string> => {
		const endpoint = USERS_ENDPOINTS.ROLES_TO_USER.replace(":uuid", params.uuid);
		return await this.#http.del<string>(endpoint, signal);
	};
}
