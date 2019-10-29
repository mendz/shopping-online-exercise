import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { CartService } from '../cart/cart.service';
import { CartProduct } from '../cart/cart-product.model';
import * as fromApp from '../store/app.reducer';

let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit, OnDestroy {
  public options: any;
  cartItemsCount = 0;
  cartProducts: CartProduct[];
  private storeSub: Subscription;

  constructor(
    private cartService: CartService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('cart').subscribe(cartState => {
      this.cartProducts = cartState.cartProducts;
      this.cartItemsCount = cartState.amountProducts;
    });

    this.options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: `Product Cart (${this.cartItemsCount})`,
      },
      credits: {
        enabled: true,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: 'Products percentage from the cart',
          colorByPoint: true,
          data: this.cartProducts.map((product: CartProduct) => ({
            name: product.name,
            y: product.amount,
          })),
        },
      ],
    };

    Highcharts.chart('chart', this.options);
  }

  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }
}
