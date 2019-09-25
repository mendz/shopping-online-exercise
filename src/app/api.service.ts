import { Injectable } from '@angular/core';
import data from '../assets/data.json';
import { Product } from './products/product.model.js';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  getProductsAPI() {
    // return new Promise<Product[]>((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(data);
    //   }, 2000);
    // });
    const products = data.map(
      item =>
        new Product(
          item._id,
          item.name,
          item.description,
          item.imagePath,
          +item.price,
          new Date(item.dateAdded)
        )
    );
    return products;
  }
}
