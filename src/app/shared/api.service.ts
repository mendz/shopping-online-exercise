import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { Store } from '@ngrx/store';

import data from '../../assets/data.json';
import { Product } from '../products/product.model';
import { ProductsService } from '../products/products.service';
import { CartProduct } from '../cart/cart-product.model.js';
import * as fromApp from '../store/app.reducer';
import * as ProductsActions from '../products/store/products.actions';

interface APIProduct {
  name: string;
  description: string;
  imagePath: string;
  costPrice: string;
  dateAdded: string;
  amount?: string;
}

interface APICart {
  userId: string;
  cartProducts: APIProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // TODO: check the code to save the cart key and use it to check if the cart is exists and not by checking the response
  cartKey: string = null;

  constructor(
    private http: HttpClient,
    private productsService: ProductsService,
    private store: Store<fromApp.AppState>
  ) {}

  fetchProducts() {
    return this.http
      .get<{ [key: string]: APIProduct }>(
        'https://shopping-online-exercise.firebaseio.com/products.json'
      )
      .pipe(
        map(responsesData => {
          const productsArray: Product[] = [];
          for (const [key, product] of Object.entries(responsesData)) {
            productsArray.push(
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
          return productsArray;
        }),
        catchError(errorRes => {
          let errorMessage = 'Unknown error occurred!';
          if (errorRes.error.error) {
            errorMessage = errorRes.error.error;
          }
          return throwError(errorMessage);
        }),
        tap((products: Product[]) => {
          // this.productsService.setProducts(products);
          this.store.dispatch(ProductsActions.setProducts({ products }));
        })
      );
  }

  updateCart(userId: string, cartProducts: CartProduct[]) {
    const cartItem = {
      userId,
      cartProducts,
    };

    let params = new HttpParams();
    params = params.append('orderBy', '"userId"');
    params = params.append('equalTo', `"${userId}"`);

    // check if the array is empty
    if (cartProducts.length === 0) {
      // if so, find the id to remove, and remove the cart
      this.http
        .get<{ [key: string]: APICart }>(
          'https://shopping-online-exercise.firebaseio.com/cart.json',
          { params }
        )
        .pipe(
          switchMap(response => {
            const cartKey = Object.keys(response)[0];
            return this.http.delete(
              `https://shopping-online-exercise.firebaseio.com/cart/${cartKey}.json`
            );
          })
        )
        .subscribe();
    } else {
      // if the array have items, check if there ia already cart in the DB
      this.http
        .get<{ [key: string]: APICart }>(
          'https://shopping-online-exercise.firebaseio.com/cart.json',
          { params }
        )
        .pipe(
          switchMap(response => {
            // have the cart in the DB
            if (Object.keys(response).length) {
              const cartKey = Object.keys(response)[0];
              return this.http.patch<{ [key: string]: APICart }>(
                'https://shopping-online-exercise.firebaseio.com/cart.json',
                {
                  [cartKey]: {
                    userId: cartItem.userId,
                    cartProducts: cartItem.cartProducts,
                  },
                }
              );
            } else {
              // create new cart
              return this.http.post<{ [key: string]: APICart }>(
                'https://shopping-online-exercise.firebaseio.com/cart.json',
                {
                  userId: cartItem.userId,
                  cartProducts: cartItem.cartProducts,
                }
              );
            }
          })
        )
        .subscribe();
    }
  }

  getCart(userId: string) {
    // check if there cart in the local storage
    // TODO: add a date to check if there a new cart in the DB
    const cartData: [
      {
        amount: string;
        costPrice: string;
        description: string;
        id: string;
        imagePath: string;
        name: string;
      }
    ] = JSON.parse(localStorage.getItem('cart'));

    if (cartData) {
      const cartProducts: CartProduct[] = [];
      for (const cartProduct of cartData) {
        const {
          amount,
          costPrice,
          description,
          id: cartId,
          imagePath,
          name,
        } = cartProduct;
        const loadedCartProduct = new CartProduct(
          cartId,
          name,
          description,
          imagePath,
          +costPrice,
          +amount
        );
        cartProducts.push(loadedCartProduct);
      }

      return of(cartProducts);
    }

    // if not load from DB
    let params = new HttpParams();
    params = params.append('orderBy', '"userId"');
    params = params.append('equalTo', `"${userId}"`);
    return this.http
      .get<{ [key: string]: APICart }>(
        'https://shopping-online-exercise.firebaseio.com/cart.json',
        {
          params,
        }
      )
      .pipe(
        map(responseData => {
          // check if there a cart in the DB
          if (Object.keys(responseData).length) {
            const [cartKey, cartObj] = Object.entries(responseData)[0];
            // get the firebase key of this specific cart
            this.cartKey = cartKey;
            // return only the cart products
            const cartProducts: CartProduct[] = cartObj.cartProducts.map(
              cartItem =>
                new CartProduct(
                  cartObj.userId,
                  cartItem.name,
                  cartItem.description,
                  cartItem.imagePath,
                  +cartItem.costPrice,
                  +cartItem.amount
                )
            );
            return cartProducts;
          } else {
            return [];
          }
        })
      );
  }

  getProductsJSONFile() {
    const products = data.map(
      item =>
        new Product(
          item._id,
          item.name,
          item.description,
          item.imagePath,
          +item.price,
          new Date(item.dateAdded)
        )
    );
    return products;
  }
}
