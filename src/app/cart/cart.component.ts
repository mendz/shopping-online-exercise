import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { CartProduct } from './cart-product.model';
import * as fromApp from '../store/app.reducer';
import * as CartActions from './store/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [
    trigger('itemRemove', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)',
        }),
        animate(300),
      ]),
      transition('* => void', [
        animate(300),
        style({
          opacity: 0,
          transform: 'translateX(100px)',
        }),
      ]),
    ]),
  ],
})
export class CartComponent implements OnInit, OnDestroy {
  products: CartProduct[];
  productsCost = 0;
  private storeSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('cart').subscribe(cartState => {
      this.products = cartState.cartProducts;
      this.productsCost = cartState.productsCost;
    });
  }

  onRemoveProduct(productName: string) {
    this.store.dispatch(CartActions.removeProductFromCart({ productName }));
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
