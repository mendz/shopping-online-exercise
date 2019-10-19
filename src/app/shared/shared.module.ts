import { NgModule } from '@angular/core';
import { ErrorBoxComponent } from './error-box/error-box.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './material.module';
import { CenteredDirective } from './centered.directive';

@NgModule({
  declarations: [ErrorBoxComponent, CenteredDirective],
  imports: [CommonModule, AppMaterialModule],
  exports: [
    CommonModule,
    AppMaterialModule,
    ErrorBoxComponent,
    CenteredDirective,
  ],
})
export class SharedModule {}
