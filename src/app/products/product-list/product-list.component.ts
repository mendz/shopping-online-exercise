import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Product } from '../product.model';
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

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.productsSub = this.store
      .select('products')
      .subscribe(productsState => {
        this.products = productsState.products;
        this.isLoading = productsState.isLoading;
        this.error = productsState.fetchError;
      });
    if (!this.products.length) {
      this.store.dispatch(ProductsActions.startFetchProducts());
    }
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
