import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private autoLogoutTimeout: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setTimerLogout(expirationDuration: number) {
    this.autoLogoutTimeout = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  }

  clearTimerLogout() {
    if (this.autoLogoutTimeout) {
      clearTimeout(this.autoLogoutTimeout);
      this.autoLogoutTimeout = null;
    }
  }
}
