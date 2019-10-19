import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { CartModule } from './cart/cart.module';
import { ChartsModule } from './charts/charts.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core.module';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ProductsModule,
    CartModule,
    ChartsModule,
    AuthModule,
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
