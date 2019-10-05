import { Injectable } from '@angular/core';
import data from '../assets/data.json';
import { Product } from './products/product.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductsService } from './products/products.service';
import { BehaviorSubject } from 'rxjs';

interface APIProduct {
  name: string;
  desc: string;
  image: string;
  price: string;
  dateAdded: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoading = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  fetchProducts() {
    this.isLoading.next(true);
    return this.http
      .get<{ [key: string]: APIProduct }>(
        'https://shopping-online-exercise.firebaseio.com/products.json'
      )
      .pipe(
        map(responsesData => {
          const productsArray: Product[] = [];
          for (const [key, product] of Object.entries(responsesData)) {
            productsArray.push(
              new Product(
                key,
                product.name,
                product.desc,
                product.image,
                +product.price,
                new Date(product.dateAdded)
              )
            );
          }
          return productsArray;
        })
      )
      .subscribe(
        (products: Product[]) => {
          this.isLoading.next(false);
          this.productsService.setProducts(products);
        },
        error => {
          this.error.next(error.error.error);
          this.isLoading.next(false);
        }
      );
  }

  getProductsJSONFile() {
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
