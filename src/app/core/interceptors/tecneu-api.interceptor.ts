import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {AuthLocalStorageService} from "../../modules/auth/services/auth-local-storage.service";
import {environment} from "../../../environments/environment";

@Injectable()
export class TecneuApiInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private authLocalStorageService: AuthLocalStorageService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.authLocalStorageService.getAuthFromLocalStorage()?.access_token ?? '';

    const reqClone = request.clone({headers: request.headers.set('Authorization', token)});
    /*console.log(reqClone);*/
    if (reqClone.url.includes(environment.apiBaseUrl)) {
      // console.log(`ENTRO AL INTERCEPTOR WITH BASE_URL ${environment.tecneu_base_url}`);
      return next.handle(reqClone).pipe(
        catchError((err) => {
          // SI EL ERROR VIENE DE UN ARCHIVO BLOB SE TRANSFORMA A JSON PARA OBTENER MENSAJES DEL ERROR O ERRORES
          if (err instanceof HttpErrorResponse && err.error instanceof Blob && err.error.type === 'application/json') {
            return from(this.blobToJson(err));
          }

          this.checkErrors(err);
          if (!err.messageError || err.messageError === '') { // Mostrar mensaje de error universal si no se encuentra detalle del error
            err.messageError = 'Ha sucedido un error desconocido en la petición al servidor';
          }
          return throwError(err);
        })
      );
    }
    return next.handle(request); // Devuelve el resultado de next.handle(request) si la condición no se cumple
  }

  checkErrors(err: Record<string, any>) {
    // UNAUTHORIZED STATUS LOG OUT
    if (err.status === 401) {
      this.authLocalStorageService.removeToken();
      this.router.navigate(['/auth/login'], {
        queryParams: {},
      });
    }
    if (err.error.msg) { // Mostrar error general
      err.messageError = err.error.msg;
    } else if (err.error.err) { // Mostrar errores generados como objeto de objetos por express-validator en el backend
      err.messageError = '';
      if (err.error.err.msg) {
        err.messageError = err.error.err.msg;
        return throwError(err);
      }
      const size = this.objectSize(err.error.err);
      let index = 0;
      // Solo mostrar el primer mensaje de error
      for (const key in err.error.err) {
        if (err.error.err.hasOwnProperty(key)) {
          const objectError = err.error.err[key];
          if (index === 0) {
            err.messageError += `${key}: ${objectError.msg}`;
          }
          index++;
        }
      }
      if (size > 1) {
        err.messageError += `...`;
      }
    } else if (err.status === 0) {
      err.messageError = 'No se pudo conectar al servidor, contacte a soporte técnico';
    }
  }

  blobToJson(err: HttpErrorResponse) {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: Event) => {
        try {
          const errmsg = JSON.parse((e.target as any).result);
          const newError = new HttpErrorResponse({
            error: errmsg,
            headers: err.headers,
            status: err.status,
            statusText: err.statusText,
            url: err.url ?? undefined
          });
          this.checkErrors(newError);
          reject(newError);
        } catch (e) {
          reject(err);
        }
      };
      reader.onerror = (e) => {
        reject(err);
      };
      reader.readAsText(err.error);
    });
  }

  objectSize(obj: Record<string, any>) {
    let size = 0;
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  }
}
