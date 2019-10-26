import { createReducer, on, Action } from '@ngrx/store';

import { Product } from '../product.model';
import * as ProductsActions from './products.actions';

export interface State {
  products: Product[];
  isLoading: boolean;
  fetchError: string;
}

const initialState: State = {
  products: [],
  isLoading: false,
  fetchError: null,
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
      isLoading: false,
    })),
    on(ProductsActions.failFetching, (state, action) => ({
      ...state,
      isLoading: false,
      fetchError: action.errorMessage,
    })),
    on(ProductsActions.startFetchProducts, state => ({
      ...state,
      isLoading: true,
      fetchError: null,
    }))
  )(productsState, productsAction);
}
