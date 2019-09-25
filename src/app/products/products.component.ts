import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ApiService } from '../api.service';

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
    const productsFromAPI = this.apiService.getProductsAPI();
    this.productsService.setProducts(productsFromAPI);
  }
}
