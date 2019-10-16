import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import data from '../assets/data.json';
import { Product } from './products/product.model';
import { ProductsService } from './products/products.service';
import { CartProduct } from './cart/cart-product.model.js';
import { CartService } from './cart/cart.service.js';

interface APIProduct {
  name: string;
  desc: string;
  image: string;
  price: string;
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
  cartKey: string = null;

  constructor(
    private http: HttpClient,
    private productsService: ProductsService,
    private cartService: CartService
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
                product.desc,
                product.image,
                +product.price,
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
          this.productsService.setProducts(products);
        })
      );
  }

  updateCart(userId: string, cartProducts: CartProduct[]) {
    // check if the array is empty
    // if so, find the id to remove, and remove the cart
    // if the array have items, check if there ia already cart in the DB
    // if so update
    // if not create new
    console.log('userId:', userId);
    console.log('cartProducts:', cartProducts);
    const cartItem = {
      userId,
      cartProducts,
    };

    this.http
      .post(
        'https://shopping-online-exercise.firebaseio.com/cart.json',
        cartItem
      )
      .subscribe(response => {
        console.log('response:', response);
      });
  }

  getCart(userId: string) {
    // check if there cart in the local storage
    // (TODO: add a date to check if there a new cart in the DB)
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

      return cartProducts;
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
          const [cartKey, cartObj] = Object.entries(responseData)[0];
          // get the firebase key of this specific cart
          this.cartKey = cartKey;
          // return only the cart products
          const cartProducts: CartProduct[] = cartObj.cartProducts.map(
            cartItem =>
              new CartProduct(
                cartObj.userId,
                cartItem.name,
                cartItem.desc,
                cartItem.image,
                +cartItem.price,
                +cartItem.amount
              )
          );
          return cartProducts;
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
