import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {catchError, finalize, map, switchMap} from 'rxjs/operators';
import {UserModel} from '../models/user.model';
import {AuthModel} from '../models/auth.model';
import {Router} from '@angular/router';
import {AuthHTTPService} from "./auth-http.service";
import {AuthLocalStorageService} from "./auth-local-storage.service";

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: → https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private authHttpService: AuthHTTPService,
    private authLocalStorageService: AuthLocalStorageService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  // public methods
  login(email: string, password: string): Observable<UserType> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth) => {
        return this.setAuthFromLocalStorage(auth);
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this.authLocalStorageService.removeToken();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.authLocalStorageService.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      return of(undefined);
    }

    // const currentUser = this.getAuthFromLocalStorage();
    // if (currentUser && currentUser.token_date && new Date().getTime() - new Date(currentUser.token_date).getTime() <= 5 * 60 * 1000) {
    //   return new Observable<UserType>((observer) => observer.next(currentUser as UserType)); // CORREGIR
    // }
    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.access_token).pipe(
      map((userJson: any) => {
        const user = new UserModel();
        user.setUser(userJson);
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // Almacenar el token de autenticación (authToken), permisos del usuario (permissions) y tiempo de expiración (expires_in)
    // en el almacenamiento local (local storage) para mantener al usuario conectado entre actualizaciones de página.
    if (auth && auth.access_token) {
      this.authLocalStorageService.setToken(JSON.stringify(auth));
      // localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }
}
