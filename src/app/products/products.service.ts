import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[];

  constructor() {}

  getProducts() {
    return [...this.products];
  }

  setProducts(products: Product[]) {
    this.products = products;
  }
}
