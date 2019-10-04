import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Subject } from 'rxjs';

@Injectable()
export class ProductsService {
  private products: Product[];
  productsChanged = new Subject<Product[]>();

  constructor() {}

  getProducts() {
    return [...(this.products || [])];
  }

  setProducts(products: Product[]) {
    this.products = products;
    this.productsChanged.next([...this.products]);
  }
}
