import { createEffect, ofType, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProductsActions from './products.actions';
import { Product } from '../product.model';

export interface APIProduct {
  name: string;
  description: string;
  imagePath: string;
  costPrice: string;
  dateAdded: string;
  amount?: string;
}

@Injectable()
export class ProductsEffects {
  getProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.startFetchProducts),
      switchMap(() => {
        return this.http.get<{ [key: string]: APIProduct }>(
          'https://shopping-online-exercise.firebaseio.com/products.json'
        );
      }),
      map(responsesData => {
        const products: Product[] = [];
        for (const [key, product] of Object.entries(responsesData)) {
          products.push(
            new Product(
              key,
              product.name,
              product.description,
              product.imagePath,
              +product.costPrice,
              new Date(product.dateAdded)
            )
          );
        }
        return ProductsActions.setProducts({ products });
      }),
      catchError(errorRes => {
        let errorMessage = 'Unknown error occurred!';
        if (errorRes.error.error) {
          errorMessage = errorRes.error.error;
        }
        return of(ProductsActions.failFetching({ errorMessage }));
      })
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
