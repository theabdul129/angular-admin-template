import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plainEnglishCase'
})
export class PlainEnglishCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return ''; // Return an empty string if the input is null or undefined

    // Convert the first character to uppercase and the rest to lowercase
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

}
