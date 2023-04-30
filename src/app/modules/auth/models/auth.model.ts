import CryptoJS from 'crypto-js';

import {environment} from "../../../../environments/environment";

export class AuthModel {
  access_token: string;
  expires_in: number; // UNIX
  permissions: string;
  token_date?: string | Date;

  // setAuth(auth: AuthModel) {
  //   this.authToken = auth.authToken;
  //   this.refreshToken = auth.refreshToken;
  //   this.expiresIn = auth.expiresIn;
  // }
  getPermissionsDecrypted(): DecryptedPermissions[] {
    const bytes = CryptoJS.AES.decrypt(this.permissions, environment.headerSecretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as DecryptedPermissions[];
  }
}

interface DecryptedPermissions {
  permission_name: string;
  privilege: string;
  tags: string[];
}
