import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IGeoData } from '@lars/interfaces/app.interfaces';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoComponent {

  @Input('table') table: IGeoData;

  fa = { link : faLink };

  constructor(
    public router: Router
  ) { }

  public sendQuery(): void {
    const geoQuery = `srl:${this.table.as.toString()}*${this.table.ss}`;
    this.router.navigate(['home/search'], { queryParams: { query: geoQuery }})
  }
  
  public sendQueryIP(): void {
    const ipQuery = `ip:${this.table.ip}`;
    this.router.navigate(['home/search'], { queryParams: { query: ipQuery }})
  }
}
