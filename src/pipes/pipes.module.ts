import { NgModule } from '@angular/core';
import { OrderTypePipe } from './order-type/order-type';
import { TimeToStringPipe } from './time-to-string/time-to-string';
@NgModule({
	declarations: [OrderTypePipe,
    TimeToStringPipe],
	imports: [],
	exports: [OrderTypePipe,
    TimeToStringPipe]
})
export class PipesModule {}
