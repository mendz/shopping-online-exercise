import { createReducer, on, Action } from '@ngrx/store';

import { CartProduct } from '../cart-product.model';
import * as CartActions from './cart.actions';

export interface State {
  cartProducts: CartProduct[];
  amountProducts: number;
  productsCost: number;
}

const initialState: State = {
  cartProducts: [],
  amountProducts: 0,
  productsCost: 0,
};

function getSumProducts(cartProducts: CartProduct[]) {
  return cartProducts.reduce(
    (sum, currentProduct) => sum + currentProduct.amount,
    0
  );
}

function getProductsCost(cartProducts: CartProduct[]) {
  return cartProducts.reduce(
    (sum, currentProduct) =>
      sum + currentProduct.costPrice * currentProduct.amount,
    0
  );
}

export function cartReducer(cartState: State | undefined, cartAction: Action) {
  return createReducer(
    initialState,
    on(CartActions.setCartProducts, (state, action) => ({
      ...state,
      cartProducts: [...action.cartProducts],
      amountProducts: getSumProducts(action.cartProducts),
      productsCost: getProductsCost(action.cartProducts),
    }))
    // on(CartActions.addProductToCart, (state, action) => {
    //   // check if the item is in the cart - currently by name
    //   console.log('state.cartProducts:', state.cartProducts);
    //   const index = state.cartProducts.findIndex(
    //     cartProduct => cartProduct.name === action.productName
    //   );
    //   const updatedCart = [...state.cartProducts];

    //   // if so, increment the amount
    //   if (index !== -1) {
    //     updatedCart[index].amount += 1;
    //   } else {
    //     // or add this new product
    //     const addedCartProduct = new CartProduct(
    //       action.userId,
    //       action.productName,
    //       action.description,
    //       action.imagePath,
    //       action.constPrice,
    //       1
    //     );
    //     updatedCart.push(addedCartProduct);
    //   }

    //   return {
    //     ...state,
    //     cartProducts: updatedCart,
    //     amountProducts: getSumProducts(updatedCart),
    //     productsCost: getProductsCost(updatedCart),
    //   };
    // }),
    // on(CartActions.removeProductFromCart, (state, action) => {
    //   // check the amount of this product
    //   const indexProductToCheck = state.cartProducts.findIndex(
    //     product => product.name === action.productName
    //   );
    //   let updatedProducts = [];

    //   // if it more then one, only decrement the value
    //   if (state.cartProducts[indexProductToCheck].amount > 1) {
    //     updatedProducts = [...state.cartProducts];
    //     updatedProducts[indexProductToCheck].amount -= 1;
    //   } else {
    //     // if it only one, remove the product
    //     updatedProducts = state.cartProducts.filter(
    //       product => product.name !== action.productName
    //     );
    //   }
    //   return {
    //     ...state,
    //     cartProducts: updatedProducts,
    //     amountProducts: getSumProducts(updatedProducts),
    //     productsCost: getProductsCost(updatedProducts),
    //   };
    // })
  )(cartState, cartAction);
}
