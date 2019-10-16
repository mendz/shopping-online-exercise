import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        // if there are already params, append the auth to them
        let params =
          req.params.keys().length > 0 ? req.params : new HttpParams();
        params = params.append('auth', user.token);

        const modifiedReq = req.clone({
          params,
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
