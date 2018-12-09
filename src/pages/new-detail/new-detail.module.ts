import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewDetailPage } from './new-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    NewDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(NewDetailPage),
    PipesModule
  ],
})
export class NewDetailPageModule {}
