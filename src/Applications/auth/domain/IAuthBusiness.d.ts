import type { UserDTO } from "../../users/domain/users.dto.js";
import type { ActivateAccountRequest } from "./request/activate-account.request";
import type { ChangePasswordRequest } from "./request/change-password.request";
import type { ForgotPasswordRequest } from "./request/forgot-password.request";
import type { LoginRequest } from "./request/login.request";
import type { RegisterRequest } from "./request/register.request";

export interface IAuthBusiness {
  login: (payload: LoginRequest["body"]) => Promise<UserDTO | null>;
  register: (payload: RegisterRequest["body"]) => Promise<UserDTO>;
  activateAccount: (payload: ActivateAccountRequest["params"]) => Promise<boolean>;
  forgotPassword: (payload: ForgotPasswordRequest["body"]) => Promise<string>;
  changePassword: (payload: ChangePasswordRequest["body"]) => Promise<boolean>;
}
