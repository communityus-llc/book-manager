import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOrderPage } from './modal-order';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ModalOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOrderPage),
    PipesModule
  ],
})
export class ModalOrderPageModule {}
