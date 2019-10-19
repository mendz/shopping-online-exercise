import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  // { path: '**', redirectTo: '/products' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
