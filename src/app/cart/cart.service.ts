import { Injectable } from '@angular/core';
import { CartProduct } from './cart-product.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartProducts: CartProduct[] = [];
  amountProducts = new Subject<number>();
  productsCost = new Subject<number>();
  cartProductsChange = new Subject<CartProduct[]>();

  constructor() {}

  getCartProducts() {
    return [...this.cartProducts];
  }

  getSumProducts() {
    return this.cartProducts.reduce(
      (sum, currentProduct) => sum + currentProduct.amount,
      0
    );
  }

  getProductsCost() {
    const cost = this.cartProducts.reduce(
      (sum, currentProduct) =>
        sum + currentProduct.costPrice * currentProduct.amount,
      0
    );
    return cost;
  }

  private updateProducts(cartProduct: CartProduct[]) {
    this.cartProductsChange.next(this.cartProducts);
    this.amountProducts.next(this.getSumProducts());
    this.productsCost.next(this.getProductsCost());
  }

  addToCart(productToAdd: CartProduct) {
    // check if the item is in the cart - currently by name
    const index = this.cartProducts.findIndex(
      cartProduct => cartProduct.name === productToAdd.name
    );
    // if so, increment the amount
    if (index !== -1) {
      this.cartProducts[index].amount += 1;
    } else {
      // or add this new product
      this.cartProducts.push(productToAdd);
    }

    this.updateProducts(this.cartProducts);
  }

  removeFromCart(productId: string) {
    // check the amount of this product
    const indexProductToCheck = this.cartProducts.findIndex(
      product => product.id === productId
    );
    // if it more then one, only decrement the value
    if (this.cartProducts[indexProductToCheck].amount > 1) {
      this.cartProducts[indexProductToCheck].amount -= 1;
    } else {
      // if it only one, remove the product
      const updatedProducts = this.cartProducts.filter(
        product => product.id !== productId
      );
      this.cartProducts = [...updatedProducts];
    }
    this.updateProducts(this.cartProducts);
  }

  setCart(cartProducts: CartProduct[]) {
    this.cartProducts = cartProducts;
    this.updateProducts(this.cartProducts);
  }
}
