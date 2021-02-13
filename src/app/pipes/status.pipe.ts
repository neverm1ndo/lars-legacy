import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  states = {
    'rebooting' : 'Перезагружается',
    'live' : 'Запущен',
    'stoped' : 'Остановлен',
    'error' : 'Нет соедниения'
  }

  transform(value: string): unknown {
      return this.states[value];
  }

}
