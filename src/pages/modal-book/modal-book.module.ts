import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBookPage } from './modal-book';

@NgModule({
  declarations: [
    ModalBookPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalBookPage),
  ],
})
export class ModalBookPageModule {}
