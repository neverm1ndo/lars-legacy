import { Pipe, PipeTransform } from '@angular/core';
import { getProcessTranslation } from './components/line-process/log-processes';

@Pipe({
  name: 'process'
})
export class ProcessPipe implements PipeTransform {

  transform(value: string): unknown {
    return getProcessTranslation(value as any);
  }

}
