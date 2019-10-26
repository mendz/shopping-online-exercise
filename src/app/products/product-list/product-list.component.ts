import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { ApiService } from 'src/app/shared/api.service';
import * as fromApp from '../../store/app.reducer';
import * as ProductsActions from '../store/products.actions';

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
    private apiService: ApiService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.productsSub = this.store
      .select('products')
      .subscribe(productsState => {
        this.products = productsState.products;
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
      });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
