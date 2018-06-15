import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalToPercentage'
})
export class DecimalToPercentagePipe implements PipeTransform {

  transform(value: number, args?: any): string {
    return Math.round(value * 10000)/100 + " %";
  }

}
