import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../../product.model';
import { CartService } from 'src/app/cart/cart.service';
import { CartProduct } from 'src/app/cart/cart-product.model';
import { ApiService } from 'src/app/api.service';
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
    private authService: AuthService
  ) {}

  ngOnInit() {}

  addToCart() {
    const userId = this.authService.user.value.id;
    this.cartService.addToCart(
      userId,
      new CartProduct(
        this.product.id,
        this.product.name,
        this.product.description,
        this.product.imagePath,
        this.product.price
      )
    );
  }
}
