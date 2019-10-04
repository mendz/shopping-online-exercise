import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ApiService } from '../api.service';
import { Product } from './product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductsService],
})
export class ProductsComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    // const productsFromAPI = this.apiService.getProductsJSONFile();
    this.apiService.fetchProducts().subscribe((products: Product[]) => {
      this.productsService.setProducts(products);
    });
  }
}
