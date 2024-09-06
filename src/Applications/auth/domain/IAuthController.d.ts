import type { ControllerHandler } from "../../../Domain/business/Business";
import type { UserSessionDTO } from "../../users/domain/users.dto.ts";
import type { UserNonSensitiveData } from "../../users/domain/IUser";

export interface IAuthController {
  login: ControllerHandler<UserSessionDTO>;
  register: ControllerHandler<UserNonSensitiveData>;
  activateAccount: ControllerHandler<boolean>;
  forgotPassword: ControllerHandler<string>;
  changePassword: ControllerHandler<boolean>;
}
