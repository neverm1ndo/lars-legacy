import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  states = {
    0 : 'Ошибка сервера',
    1 : 'Остановлен',
    2 : 'Перезагружается',
    3 : 'Запущен',
    4 : 'Загружается',
  }

  transform(value: number): unknown {
      return this.states[value];
  }

}
