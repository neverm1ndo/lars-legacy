import { Pipe, PipeTransform } from '@angular/core';
import { Workgroup } from '../enums';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  private translations = {
    [Workgroup.Challenger]: 'Претендент',
    [Workgroup.Dev]: 'Разработчик',
    [Workgroup.Admin]: 'Админ',
    [Workgroup.Mapper]: 'Маппер',
    [Workgroup.CFR]: 'Ред. конф. файлов',
    [Workgroup.Backuper]: 'Бэкапер',
  }

  transform(value: number): string {
    return this.translations[value]?this.translations[value]:'Игрок';
  }
}
