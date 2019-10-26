import { createReducer, on, Action } from '@ngrx/store';
import { Product } from '../product.model';

export interface State {
  products: Product[];
}

const initialState: State = {
  products: [],
};

export function productsReducer(
  productsState: State | undefined,
  productsAction: Action
) {
  return createReducer(initialState)(productsState, productsAction);
}
