import { IUser } from "../IUser";

export interface CreateUserRequest {
  query: object;
  params: object;
  body: Pick<IUser, "email" | "name" | "password" /* | "roles" */>;
}
