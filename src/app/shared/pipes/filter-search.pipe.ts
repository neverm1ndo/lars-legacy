import { Pipe, PipeTransform } from '@angular/core';
import { ProcessWithName } from '@lars/settings/filter/filter.component';

@Pipe({
  name: 'filterSearch'
})
export class FilterSearchPipe implements PipeTransform {

  transform(value: ProcessWithName[], input: string): ProcessWithName[] {
    return value.filter((val) => ((val.translate as string).toLowerCase()).startsWith(input.toLowerCase()));
  }

}
