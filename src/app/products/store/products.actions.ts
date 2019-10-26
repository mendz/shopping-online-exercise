import { createAction, props } from '@ngrx/store';

import { Product } from '../product.model';

export const startFetchProducts = createAction(
  '[Products] Start Fetch products'
);

export const failFetching = createAction(
  '[Products] Fail Fetching',
  props<{ errorMessage: string }>()
);

export const setProducts = createAction(
  '[Products] Set Products',
  props<{ products: Product[] }>()
);
