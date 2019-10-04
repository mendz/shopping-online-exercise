import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  private productsSub: Subscription;
  isLoading = false;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.products = this.productsService.getProducts();
    this.isLoading = true;
    this.productsSub = this.productsService.productsChanged.subscribe(
      (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }
}
