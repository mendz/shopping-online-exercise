import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount = 0;
  @Input() isLoggedIn: boolean;
  private storeCartSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeCartSub = this.store.select('cart').subscribe(cartState => {
      this.cartItemsCount = cartState.amountProducts;
    });
  }

  ngOnDestroy() {
    this.storeCartSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
