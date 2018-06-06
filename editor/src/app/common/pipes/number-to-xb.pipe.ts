import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToXb'
})
export class NumberToXbPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    return this.formatBytes(value);
  }

    // from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    private formatBytes(a, b?) {
        if (0 == a) return "0 Bytes";
        var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }
}


