import { createAction, props } from '@ngrx/store';
import { CartProduct } from '../cart-product.model';

export const setCartProducts = createAction(
  '[Cart] Set Cart Products',
  props<{ cartProducts: CartProduct[] }>()
);

export const addProductToCart = createAction(
  '[Cart] Add Product To Cart',
  props<{
    productName: string;
    description: string;
    imagePath: string;
    constPrice: number;
  }>()
);

export const removeProductFromCart = createAction(
  '[Cart] Remove Product From Cart',
  props<{ productName: string }>()
);

export const updatingCart = createAction(
  '[Cart] Updating Cart',
  props<{ userId: string }>()
);

export const getCart = createAction(
  '[Cart] Get Cart',
  props<{ userId: string }>()
);

export const logoutCart = createAction('[Cart] Logout Cart');
