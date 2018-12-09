import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddBookPage } from './modal-add-book';

@NgModule({
  declarations: [
    ModalAddBookPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddBookPage),
  ],
})
export class ModalAddBookPageModule {}
