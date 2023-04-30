import CryptoJS from 'crypto-js';

import {environment} from "../../../../environments/environment";
import {Permissions} from "./required-permissions.interface";

export class AuthModel {
  access_token: string;
  expires_in: number; // UNIX
  permissions: string;
  token_date?: string | Date;

  getPermissionsDecrypted(): DecryptedPermissions[] {
    const bytes = CryptoJS.AES.decrypt(this.permissions, environment.headerSecretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as DecryptedPermissions[];
  }

  hasPermission(requiredPermission: Permissions): boolean {
    const permissions = this.getPermissionsDecrypted();

    const permission = permissions.find(p => p.permission_name === requiredPermission.permissionName && requiredPermission.validPrivileges?.includes(p.privilege));

    return !!permission;
  }
}

interface DecryptedPermissions {
  permission_name: string;
  privilege: string;
  tags: string[];
}
