import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ChartsComponent } from './charts.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  declarations: [ChartsComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChartsComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class ChartsModule {}
