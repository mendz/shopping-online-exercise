import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private storeSub: Subscription;
  isLoggedIn = false;

  navLinks = [
    { path: '/products', label: 'Products' },
    { path: '/charts', label: 'Charts' },
  ];

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoggedIn = !!authState.user;
    });
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
