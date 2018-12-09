import { Pipe, PipeTransform } from '@angular/core';
import { ORDER_TYPE } from '../../providers/app-module/app-constants';

/**
 * Generated class for the OrderTypePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'orderType',
})
export class OrderTypePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if (value == ORDER_TYPE.WAIT) {
      return "Đang chờ xử lý";
    } 
    else if (value == ORDER_TYPE.PENDING) {
      return "Đang đợi thành toán";
    } 
    else if (value == ORDER_TYPE.CONFIRMED) {
      return "Đã xác nhận";
    }
    else if (value == ORDER_TYPE.COMPLETE) {
      return "Đã hoàn thành";
    }
    else if (value == ORDER_TYPE.CANCEL) {
      return "Bị hủy"
    }
    return "Đang chờ xử lý";
  }
}
