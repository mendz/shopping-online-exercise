import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount = 0;
  isLoggedIn = false;
  private activatedSubAuthLogin: Subscription;
  private storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('cart').subscribe(cartState => {
      this.cartItemsCount = cartState.amountProducts;
    });
    // this.activatedSubCartAmount = this.cartService.amountProducts.subscribe(
    //   (count: number) => {
    //     this.cartItemsCount = count;
    //   }
    // );

    this.activatedSubAuthLogin = this.authService.user.subscribe(
      (user: User) => {
        this.isLoggedIn = !!user;
      }
    );
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
    this.activatedSubAuthLogin.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
