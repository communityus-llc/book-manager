import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

/**
 * Generated class for the TimeToStringPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timeToString',
})
export class TimeToStringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    if (value) {
      return moment(value).format("DD-MM-YYYY hh:mm");
    }
    return "";
  }
}
