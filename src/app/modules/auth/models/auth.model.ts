export class AuthModel {
  access_token: string;
  token_date?: string | Date;
  expires_in: Date;

  // expiresIn: Date;

  // setAuth(auth: AuthModel) {
  //   this.authToken = auth.authToken;
  //   this.refreshToken = auth.refreshToken;
  //   this.expiresIn = auth.expiresIn;
  // }
}
