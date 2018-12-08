import { Pipe, PipeTransform } from '@angular/core';

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
    if (value == 2) {
      return "Đã hoàn thành";
    } 
    else if (value == -1) {
      return "Đang chờ xử lý";
    } 
    else if (value == 1) {
      return "Đang đợi thanh toán";
    }
    else if (value == 0) {
      return "Bị hủy";
    }
    return "Đang chờ xử lý";
  }
}
