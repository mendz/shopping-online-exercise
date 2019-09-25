import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service';
import { CartProduct } from './cart-product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  products: CartProduct[];
  productsCost = 0;
  private activatedSubProductsChange: Subscription;
  private activatedSubCost: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.products = this.cartService.getCartProducts();
    this.activatedSubProductsChange = this.cartService.cartProductsChange.subscribe(
      (cartProducts: CartProduct[]) => {
        this.products = cartProducts;
      }
    );

    this.productsCost = this.cartService.getProductsCost();
    this.activatedSubCost = this.cartService.productsCost.subscribe(
      (cost: number) => {
        this.productsCost = cost;
      }
    );
  }

  onRemoveProduct(productName: string) {
    this.cartService.removeFromCart(productName);
  }

  ngOnDestroy() {
    this.activatedSubProductsChange.unsubscribe();
    this.activatedSubCost.unsubscribe();
  }
}
