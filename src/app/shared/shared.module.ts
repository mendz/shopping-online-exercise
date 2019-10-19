import { NgModule } from '@angular/core';
import { ErrorBoxComponent } from './error-box/error-box.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CenteredDirective } from './centered.directive';

@NgModule({
  declarations: [ErrorBoxComponent, CenteredDirective],
  imports: [CommonModule, AppMaterialModule, BrowserAnimationsModule],
  exports: [
    CommonModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    ErrorBoxComponent,
    CenteredDirective,
  ],
})
export class SharedModule {}
