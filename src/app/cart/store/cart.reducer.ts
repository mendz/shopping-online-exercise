import { createReducer, on, Action } from '@ngrx/store';

import { CartProduct } from '../cart-product.model';
import * as CartActions from './cart.actions';

export interface State {
  cartProducts: CartProduct[];
  amountProducts: number;
  productsCost: number;
}

const initialState: State = {
  cartProducts: [],
  amountProducts: 0,
  productsCost: 0,
};

function getSumProducts(cartProducts: CartProduct[]) {
  return cartProducts.reduce(
    (sum, currentProduct) => sum + currentProduct.amount,
    0
  );
}

function getProductsCost(cartProducts: CartProduct[]) {
  return cartProducts.reduce(
    (sum, currentProduct) =>
      sum + currentProduct.costPrice * currentProduct.amount,
    0
  );
}

export function cartReducer(cartState: State | undefined, cartAction: Action) {
  return createReducer(
    initialState,
    on(CartActions.setCartProducts, (state, action) => ({
      ...state,
      cartProducts: [...action.cartProducts],
      amountProducts: getSumProducts(action.cartProducts),
      productsCost: getProductsCost(action.cartProducts),
    })),
    on(CartActions.logoutCart, state => ({
      ...state,
      cartProducts: [],
      amountProducts: 0,
      productsCost: 0,
    }))
  )(cartState, cartAction);
}
