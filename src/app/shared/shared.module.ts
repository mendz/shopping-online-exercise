import { NgModule } from '@angular/core';
import { ErrorBoxComponent } from './error-box/error-box.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './material.module';
import { CenteredDirective } from './centered.directive';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [ErrorBoxComponent, CenteredDirective, AlertComponent],
  imports: [CommonModule, AppMaterialModule],
  exports: [
    CommonModule,
    AppMaterialModule,
    ErrorBoxComponent,
    CenteredDirective,
    AlertComponent,
  ],
})
export class SharedModule {}
