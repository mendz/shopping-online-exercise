import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Product } from '../../product.model';
import * as fromApp from 'src/app/store/app.reducer';
import * as CartActions from '../../../cart/store/cart.actions';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: Product;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {}

  onAddedToCart() {
    this.store.dispatch(
      CartActions.addProductToCart({
        productName: this.product.name,
        description: this.product.description,
        imagePath: this.product.imagePath,
        constPrice: this.product.price,
      })
    );
  }
}
