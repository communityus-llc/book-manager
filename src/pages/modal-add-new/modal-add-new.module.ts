import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddNewPage } from './modal-add-new';

@NgModule({
  declarations: [
    ModalAddNewPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddNewPage),
  ],
})
export class ModalAddNewPageModule {}
