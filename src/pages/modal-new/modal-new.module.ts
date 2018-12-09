import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalNewPage } from './modal-new';

@NgModule({
  declarations: [
    ModalNewPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalNewPage),
  ],
})
export class ModalNewPageModule {}
