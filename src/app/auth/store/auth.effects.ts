import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import * as CartActions from '../../cart/store/cart.actions';
import * as ProductsActions from '../../products/store/products.actions';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(authActions => {
        const { email, password } = authActions;
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDysPoiPj9MgnE_79eSjNUf5EJpUoUSmXA',
            {
              email,
              password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(responseData => {
              this.authService.setTimerLogout(+responseData.expiresIn * 1000);
            }),
            mergeMap(responseData => {
              const { idToken, email: resEmail, localId } = responseData;
              // the current date + when the **seconds** (*1000 = ms)the token is expired
              const expirationDate = new Date(
                new Date().getTime() + +responseData.expiresIn * 1000
              );
              const user = new User(resEmail, localId, idToken, expirationDate);
              //   this.autoLogout(+responseData.expiresIn * 1000);
              localStorage.setItem('userData', JSON.stringify(user));

              this.router.navigate(['/']);

              return [
                AuthActions.authenticateSuccess({ user }),
                CartActions.getCart({ userId: localId }),
              ];
            }),
            catchError((errorResponse: any) => {
              let errorMessage = 'An error ocurred!';
              if (!errorResponse.error || !errorResponse.error.error) {
                return of(AuthActions.authenticateFail({ errorMessage }));
              }
              switch (errorResponse.error.error.message) {
                case 'EMAIL_NOT_FOUND':
                  errorMessage = 'The email or password is not correct';
                  break;
                case 'INVALID_PASSWORD':
                  errorMessage = 'The email or password is not correct';
                  break;
                default:
                  break;
              }
              return of(AuthActions.authenticateFail({ errorMessage }));
            })
          );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() => {
        this.authService.clearTimerLogout();
        localStorage.removeItem('userData');
        this.router.navigate(['/login']);
        return [CartActions.logoutCart(), ProductsActions.productsLogout()];
      })
    )
  );

  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        // no user data in the local storage
        if (!userData) {
          return [{ type: 'DUMMY' }];
        }

        const { email, id, _token, _tokenExpirationDate } = userData;
        const loadedUser = new User(
          email,
          id,
          _token,
          new Date(_tokenExpirationDate)
        );

        // a getter which will check if the token is valid
        if (loadedUser.token) {
          const expirationDurationLeft =
            new Date(_tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setTimerLogout(expirationDurationLeft);

          return [
            AuthActions.authenticateSuccess({
              user: loadedUser,
            }),
            CartActions.getCart({ userId: id }),
          ];
        }
        return [{ type: 'DUMMY' }];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
