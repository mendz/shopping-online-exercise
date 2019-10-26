import { createAction, props } from '@ngrx/store';
import { CartProduct } from '../cart-product.model';

export const SetCartProducts = createAction(
  '[Cart] Set Cart Products',
  props<{ cartProducts: CartProduct[] }>()
);
