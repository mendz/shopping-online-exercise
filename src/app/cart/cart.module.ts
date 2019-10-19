import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CartComponent } from './cart.component';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  declarations: [CartComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CartComponent, canActivate: [AuthGuard] },
    ]),
  ],
})
export class CartModule {}
