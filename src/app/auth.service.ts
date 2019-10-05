import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { ProductsService } from './products/products.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private productsService: ProductsService
  ) {}

  // isAuthenticated() {
  //   const promise = new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(this.isLoggedIn);
  //     }, 800);
  //   });
  //   return promise;
  // }

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
    // set the products to empty array when the user logged out
    this.productsService.setProducts([]);
    this.router.navigate(['/login']);
  }
}
