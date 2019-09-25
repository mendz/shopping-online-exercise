import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../product.model';
import { CartService } from 'src/app/cart/cart.service';
import { CartProduct } from 'src/app/cart/cart-product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  constructor(private cartService: CartService) {}

  ngOnInit() {}

  addToCart() {
    this.cartService.addToCart(
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
