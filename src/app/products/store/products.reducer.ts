import { createReducer, on, Action } from '@ngrx/store';

import { Product } from '../product.model';
import * as ProductsActions from './products.actions';

export interface State {
  products: Product[];
  isLoading: boolean;
}

const initialState: State = {
  products: [],
  isLoading: false,
};

export function productsReducer(
  productsState: State | undefined,
  productsAction: Action
) {
  return createReducer(
    initialState,
    on(ProductsActions.setProducts, (state, action) => ({
      ...state,
      products: [...action.products],
    }))
  )(productsState, productsAction);
}
