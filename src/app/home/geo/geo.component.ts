import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IGeoData } from '@lars/interfaces/app.interfaces';
import { faClipboardList, faLink } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ToastService } from '@lars/toast.service';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoComponent {

  @Input('table') table: IGeoData;

  fa = { 
    link : faLink,
    clipboard: faClipboardList
  };

  constructor(
    public router: Router,
    private _toast: ToastService,
  ) { }

  public sendQuery(): void {
    const geoQuery = `srl:${this.table.as.toString()}*${this.table.ss}`;
    this.router.navigate(['home/search'], { queryParams: { query: geoQuery }})
  }

  public copyToClipboard(): void {
    const text: string = Object.entries(this.table)
                               .reduce((acc: string, [key, value]: [string, any]) => {
                                  acc += `${key}:${value}\r\n`;
                                  return acc;
                               }, '');
    navigator.clipboard.writeText(text)
                       .then(() => {
                          this._toast.show('success', 'Геодата скопирована в буффер обмена', null, faClipboardList);
                       }, () => {
                          this._toast.show('warning', 'Ошибка доступа к буфферу обмена');
                       });
  }
  
  public sendQueryIP(): void {
    const ipQuery = `ip:${this.table.ip}`;
    this.router.navigate(['home/search'], { queryParams: { query: ipQuery }})
  }
}
