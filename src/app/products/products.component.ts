import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // const productsFromAPI = this.apiService.getProductsJSONFile();
    this.apiService.fetchProducts();
  }
}
