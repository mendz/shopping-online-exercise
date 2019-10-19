import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';

import { ProductsComponent } from './products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductItemComponent } from './product-list/product-item/product-item.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductEditComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class ProductsModule {}
