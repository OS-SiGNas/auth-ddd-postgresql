import type { ControllerHandler } from "../../../Domain/business/Business";
import type { UserNonSensitiveData } from "./IUser";

export interface IUsersController {
  readonly getUser: ControllerHandler<UserNonSensitiveData>;
  readonly getAllUsers: ControllerHandler<UserNonSensitiveData[]>;
  readonly postUser: ControllerHandler<UserNonSensitiveData>;
  readonly patchUser: ControllerHandler<string>;
  // putUser: ControllerHandler<PutUserRequest, UserNonSensitiveData>;
  readonly createRole: ControllerHandler<string>;
  readonly addUserRole: ControllerHandler<UserNonSensitiveData>;
  readonly deleteUser: ControllerHandler<string>;
}
