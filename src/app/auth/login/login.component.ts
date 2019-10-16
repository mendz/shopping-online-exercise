import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { map, tap, mergeMap, flatMap, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CartProduct } from 'src/app/cart/cart-product.model';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  minPasswordLength = 6;
  showPermissionIssue = false;
  error: string = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    if (this.authService.user.value) {
      this.router.navigate(['/']);
    }

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minPasswordLength),
      ]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.authService
      .login(email, password)
      .pipe(
        map(
          responseData => {
            this.isLoading = false;
            this.router.navigate(['/products']);
            return responseData.localId;
          },
          (errorMessage: string) => {
            this.isLoading = false;
            this.error = errorMessage;
            this.showPermissionIssue = true;
          }
        ),
        switchMap(userId => {
          return this.apiService.getCart(userId);
        })
      )
      .subscribe((cartProducts: CartProduct[]) => {
        console.log('cartProducts:', cartProducts);
        this.cartService.setCart(cartProducts);
      });

    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.onLogin(email, password);
    }
  }

  getColor() {
    if (!this.showPermissionIssue) {
      return 'green';
    } else {
      return 'red';
    }
  }
}
