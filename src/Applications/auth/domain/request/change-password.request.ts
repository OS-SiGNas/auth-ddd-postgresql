export interface ChangePasswordRequest {
  params: object;
  query: object;
  body: {
    email: string;
    verificationString: string;
    newPassword: string;
  };
}
