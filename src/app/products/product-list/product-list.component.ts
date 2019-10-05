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
  private loadingSub: Subscription;
  private errorSub: Subscription;
  isLoading: boolean;
  error: string;

  constructor(
    private productsService: ProductsService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadingSub = this.apiService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
    this.errorSub = this.apiService.error.subscribe((error: string) => {
      this.error = error;
    });
    this.productsSub = this.productsService.productsChanged.subscribe(
      (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
      }
    );
    this.products = this.productsService.getProducts();
  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
    this.loadingSub.unsubscribe();
    this.errorSub.unsubscribe();
  }
}
