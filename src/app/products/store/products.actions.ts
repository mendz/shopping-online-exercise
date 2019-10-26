import { createAction, props } from '@ngrx/store';

import { Product } from '../product.model';

export const setProducts = createAction(
  '[Products] Set Products',
  props<{ products: Product[] }>()
);
