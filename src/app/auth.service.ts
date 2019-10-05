import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from './products/products.service';
import { CartService } from './cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  login(userName: string, password: string) {
    if (userName === 'admin' && password === '1234') {
      this.isLoggedIn.next(true);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.next(false);
    // set the products and the cart to empty array when the user logged out
    // TODO: maybe set the cart products to user?
    this.productsService.setProducts([]);
    this.cartService.setCart([]);
    this.router.navigate(['/login']);
  }
}
