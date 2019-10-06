import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemsCount = 0;
  isLoggedIn = false;
  private activatedSubCartAmount: Subscription;
  private activatedSubAuthLogin: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedSubCartAmount = this.cartService.amountProducts.subscribe(
      (count: number) => {
        this.cartItemsCount = count;
      }
    );

    this.activatedSubAuthLogin = this.authService.user.subscribe(
      (user: User) => {
        this.isLoggedIn = !!user;
      }
    );
  }

  ngOnDestroy() {
    this.activatedSubCartAmount.unsubscribe();
    this.activatedSubAuthLogin.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
