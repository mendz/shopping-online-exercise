import { ActionReducerMap } from '@ngrx/store';

import * as fromAuthReducer from '../auth/store/auth.reducer';
import * as fromProductsReducer from '../products/store/products.reducer';
import * as fromCartReducer from '../cart/store/cart.reducer';

export interface AppState {
  auth: fromAuthReducer.State;
  products: fromProductsReducer.State;
  cart: fromCartReducer.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuthReducer.authReducer,
  products: fromProductsReducer.productsReducer,
  cart: fromCartReducer.cartReducer,
};
