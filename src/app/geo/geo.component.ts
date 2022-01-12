import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GeoData } from '../interfaces/app.interfaces';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeoComponent implements OnInit {

  @Input('table') table: GeoData;
  @Input('tab-style') style: 'normal' | 'inline' | undefined;

  fa = { link : faLink };

  constructor(
    public router: Router
  ) { }

  sendQuery(): void {
    const geoQuery = `srl:${this.table.as.toString()}*${this.table.ss}`;
    this.router.navigate(['home/search'], { queryParams: { query: geoQuery }})
  }
  sendQueryIP(): void {
    const ipQuery = `ip:${this.table.ip}`;
    this.router.navigate(['home/search'], { queryParams: { query: ipQuery }})
  }

  ngOnInit(): void {
  }

}
