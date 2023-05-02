import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../modules/auth";
import {RequiredPermission} from "../modules/auth/models/required-permissions.interface";

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivateChild {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve, reject) => {
      try {
        this.authService.getUserByToken().subscribe(user => {
          if (!user) {
            this.authService.logout();
            return resolve(false);
          }

          const requiredPermissions = childRoute.data?.permissions as RequiredPermission[] | undefined;

          if (!requiredPermissions || requiredPermissions.every(requiredPermission => user.hasPermission(requiredPermission))) {
            return resolve(true);
          }

          // Redireccionar al componente de error 403
          this.router.navigate(['error', '403']);
          return resolve(false);

        });
      } catch (e) {
        this.authService.logout();
        return reject(e);
      }
    });
  }

}
