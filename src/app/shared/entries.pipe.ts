import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'entries'
})
export class EntriesPipe implements PipeTransform {

  transform(value: unknown): any[] {
    return Object.entries(value);
  }
}
