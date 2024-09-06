export interface AddUserRolesRequest {
  params: { uuid: string };
  query: object;
  body: {
    roles: number[];
  };
}
