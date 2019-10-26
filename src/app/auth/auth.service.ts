import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CartService } from '../cart/cart.service';
import { User } from './user.model';
import { ApiService } from '../shared/api.service';
import * as fromApp from '../store/app.reducer';
import * as ProductsActions from '../products/store/products.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private autoLogoutTimeout: any;

  constructor(
    private router: Router,
    private cartService: CartService,
    private http: HttpClient,
    private api: ApiService,
    private store: Store<fromApp.AppState>
  ) {}

  login(email: string, password: string) {
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
        catchError(errorResponse => {
          let errorMessage = 'An error ocurred!';
          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
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
          return throwError(errorMessage);
        }),
        tap(responseData => {
          const { idToken, email: resEmail, localId } = responseData;
          // the current date + when the **seconds** (*1000 = ms)the token is expired
          const expirationDate = new Date(
            new Date().getTime() + +responseData.expiresIn * 1000
          );
          const user = new User(resEmail, localId, idToken, expirationDate);
          this.user.next(user);
          this.autoLogout(+responseData.expiresIn * 1000);
          localStorage.setItem('userData', JSON.stringify(user));
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    // no user data in the local storage
    if (!userData) {
      return;
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
      this.user.next(loadedUser);
      const expirationDurationLeft =
        new Date(_tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDurationLeft);

      // fetch the cart
      this.api
        .getCart(this.user.value.id)
        .pipe(first()) // will end the subscription after the first event.
        .subscribe(cartProducts => {
          this.cartService.setCart(cartProducts);
        });
    }
  }

  logout() {
    // set the products and the cart to empty array when the user logged out
    this.store.dispatch(ProductsActions.setProducts({ products: [] }));
    this.cartService.setCart([]);
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
    if (this.autoLogoutTimeout) {
      clearTimeout(this.autoLogoutTimeout);
    }
    this.autoLogoutTimeout = null;
  }

  autoLogout(expirationDuration: number) {
    this.autoLogoutTimeout = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
