import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as CartActions from './cart.actions';
import { APIProduct } from '../../products/store/products.effects';
import { CartProduct } from '../cart-product.model';

interface APICart {
  userId: string;
  cartProducts: APIProduct[];
}

@Injectable()
export class CartEffects {
  addProductToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addProductToCart),
      withLatestFrom(this.store.select('cart'), this.store.select('auth')),
      map(([cartAction, cartState, authState]) => {
        const { constPrice, description, imagePath, productName } = cartAction;
        const { cartProducts } = cartState;
        const {
          user: { id: userId },
        } = authState;

        const index = cartProducts.findIndex(
          cartProduct => cartProduct.name === productName
        );
        const updatedCart = [...cartProducts];

        // if so, increment the amount
        if (index !== -1) {
          updatedCart[index].amount += 1;
        } else {
          // or add this new product
          const addedCartProduct = new CartProduct(
            userId,
            productName,
            description,
            imagePath,
            constPrice,
            1
          );
          updatedCart.push(addedCartProduct);
        }

        return CartActions.setCartProducts({ cartProducts: updatedCart });
      })
    )
  );

  removeProductToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeProductFromCart),
      withLatestFrom(this.store.select('cart')),
      map(([cartAction, cartState]) => {
        const { productName } = cartAction;
        const { cartProducts } = cartState;

        const indexProductToCheck = cartProducts.findIndex(
          product => product.name === productName
        );
        let updatedProducts = [];

        // if it more then one, only decrement the value
        if (cartProducts[indexProductToCheck].amount > 1) {
          updatedProducts = [...cartProducts];
          updatedProducts[indexProductToCheck].amount -= 1;
        } else {
          // if it only one, remove the product
          updatedProducts = cartProducts.filter(
            product => product.name !== productName
          );
        }
        return CartActions.setCartProducts({ cartProducts: updatedProducts });
      })
    )
  );

  updateDBCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.setCartProducts),
        withLatestFrom(this.store.select('cart'), this.store.select('auth')),
        switchMap(([cartAction, cartState, authState]) => {
          const {
            user: { id: userId },
          } = authState;
          const { cartProducts } = cartState;
          localStorage.setItem('cart', JSON.stringify(cartProducts));

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
            return this.http
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
              );
          } else {
            // if the array have items, check if there ia already cart in the DB
            return this.http
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
              );
          }
        })
      ),
    { dispatch: false }
  );

  getCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.getCart),
      switchMap(cartAction => {
        const { userId } = cartAction;
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

          return of(CartActions.setCartProducts({ cartProducts }));
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
                // this.cartKey = cartKey;
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

                return CartActions.setCartProducts({ cartProducts });
              } else {
                return CartActions.setCartProducts({ cartProducts: [] });
              }
            })
          );
      })
    )
  );

  logoutCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.logoutCart),
        tap(() => {
          localStorage.removeItem('cart');
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
