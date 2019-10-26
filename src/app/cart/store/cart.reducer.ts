import { createReducer, on, Action } from '@ngrx/store';
import { CartProduct } from '../cart-product.model';

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

export function cartReducer(cartState: State | undefined, cartAction: Action) {
  return createReducer(initialState)(cartState, cartAction);
}
