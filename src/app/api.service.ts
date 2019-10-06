import { Injectable } from '@angular/core';
import data from '../assets/data.json';
import { Product } from './products/product.model';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { ProductsService } from './products/products.service';
import { throwError } from 'rxjs';

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
  constructor(
    private http: HttpClient,
    private productsService: ProductsService
  ) {}

  fetchProducts() {
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
        }),
        catchError(errorRes => {
          let errorMessage = 'Unknown error occurred!';
          if (errorRes.error.error) {
            errorMessage = errorRes.error.error;
          }
          return throwError(errorMessage);
        }),
        tap((products: Product[]) => {
          this.productsService.setProducts(products);
        })
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
