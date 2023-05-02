import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {AuthModel} from "../models/auth.model";

@Injectable({
  providedIn: 'root'
})
export class AuthLocalStorageService {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  setToken(token: string): void {
    localStorage.setItem(this.authLocalStorageToken, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authLocalStorageToken);
  }

  removeToken(): void {
    localStorage.removeItem(this.authLocalStorageToken);
  }

  getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = this.getToken();
      if (!lsValue) {
        return undefined;
      }

      return JSON.parse(lsValue);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
