import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListbookPage } from './listbook';

@NgModule({
  declarations: [
    ListbookPage,
  ],
  imports: [
    IonicPageModule.forChild(ListbookPage),
  ],
})
export class ListbookPageModule {}
