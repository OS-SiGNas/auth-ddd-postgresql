import type { ControllerHandler } from "../../../Domain/business/Business";
import type { UserNonSensitiveData } from "./IUser";

export interface IUsersController {
	readonly getOneUser: ControllerHandler<UserNonSensitiveData>;
	readonly getAllUsers: ControllerHandler<UserNonSensitiveData[]>;
	readonly postUser: ControllerHandler<UserNonSensitiveData>;
	readonly patchUser: ControllerHandler<string>;
	readonly createRole: ControllerHandler<string>;
	readonly rolesToUser: ControllerHandler<UserNonSensitiveData>;
	readonly deleteUser: ControllerHandler<string>;
}
