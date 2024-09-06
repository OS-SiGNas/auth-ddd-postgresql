export interface ForgotPasswordRequest {
  query: object;
  params: object;
  body: {
    email: string;
  };
}
