import CryptoJS from 'crypto-es';

import {environment} from "../../../../environments/environment";
import {RequiredPermission} from "./required-permissions.interface";

export class AuthModel {
  access_token: string;
  expires_in: number; // UNIX
  permissions: string;
  token_date?: string | Date;

  getPermissionsDecrypted(): DecryptedPermissions[] {
    const bytes = CryptoJS.AES.decrypt(this.permissions, environment.headerSecretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as DecryptedPermissions[];
  }

  // hasPermission(requiredPermission: RequiredPermission): boolean {
  //   const permissions = this.getPermissionsDecrypted();
  //
  //   const permission = permissions.find(p => p.permission_name === requiredPermission.permissionName && requiredPermission.validPrivileges?.includes(p.privilege));
  //
  //   return !!permission;
  // }
  hasPermission(requiredPermission: RequiredPermission): boolean {
    const permissions = this.getPermissionsDecrypted();

    const permission = permissions.find(p => {
      const hasPermissionName = p.permission_name === requiredPermission.permissionName;
      const hasValidPrivilege = !requiredPermission.validPrivileges || requiredPermission.validPrivileges.some(privilege => privilege === p.privilege);
      const hasValidTag = !requiredPermission.tags || requiredPermission.tags.some(tag => p.tags && p.tags.includes(tag));

      return hasPermissionName && ((!requiredPermission.validPrivileges && hasValidTag) || (!requiredPermission.tags && hasValidPrivilege) || (hasValidPrivilege && hasValidTag));
    });

    return !!permission;
  }
}

interface DecryptedPermissions {
  permission_name: string;
  privilege: string;
  tags: string[];
}
