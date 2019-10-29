import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CartProduct } from './cart-product.model';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import * as CartActions from './store/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  products: CartProduct[];
  productsCost = 0;
  private storeSub: Subscription;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('cart').subscribe(cartState => {
      this.products = cartState.cartProducts;
      this.productsCost = cartState.productsCost;
    });
    // this.products = this.cartService.getCartProducts();
    // this.activatedSubProductsChange = this.cartService.cartProductsChange.subscribe(
    //   (cartProducts: CartProduct[]) => {
    //     this.products = cartProducts;
    //   }
    // );

    // this.productsCost = this.cartService.getProductsCost();
    // this.activatedSubCost = this.cartService.productsCost.subscribe(
    //   (cost: number) => {
    //     this.productsCost = cost;
    //   }
    // );
  }

  onRemoveProduct(productName: string) {
    // this.cartService.removeFromCart(productName);
    this.store.dispatch(CartActions.removeProductFromCart({ productName }));
    // this.apiService.updateCart(userId, this.products);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
