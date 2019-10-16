import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  private productsSub: Subscription;
  isLoading: boolean;
  error: string;

  constructor(
    private productsService: ProductsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.productsSub = this.productsService.productsChanged.subscribe(
      (products: Product[]) => {
        this.products = products;
      }
    );
    this.products = this.productsService.getProducts();
    if (!this.products.length) {
      this.isLoading = true;
      this.apiService.fetchProducts().subscribe(
        products => {
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.error = error;
        }
      );
    }
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }
}
