import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../product.model';
import { CartService } from 'src/app/cart/cart.service';
import { CartProduct } from 'src/app/cart/cart-product.model';
import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  addToCart() {
    const userId = this.authService.user.value.id;
    const cartProducts = this.cartService.getCartProducts();
    const allOtherProducts = cartProducts.filter(
      product => product.name !== this.product.name
    );
    let amount = 1;

    // check if the product is in the cart
    const selectedProduct = cartProducts.find(
      product => product.name === this.product.name
    );
    if (selectedProduct) {
      amount = selectedProduct.amount + 1;
    }

    const addedCartProduct = new CartProduct(
      userId,
      this.product.name,
      this.product.description,
      this.product.imagePath,
      this.product.price,
      amount
    );
    this.cartService.addToCart(addedCartProduct);
    this.apiService.updateCart(userId, [...allOtherProducts, addedCartProduct]);
  }
}
