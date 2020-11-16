import { Component, OnInit, Input } from '@angular/core';
import { GeoData } from '../interfaces/app.interfaces';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  @Input('table') table: GeoData;

  fa = { link : faLink };

  constructor(
    public api: ApiService,
    public router: Router
  ) { }

  searchSerials(): void {
    this.api.search({ as: this.table.as.toString(), ss: this.table.ss });
  }
  sendQuery(): void {
    let geoQuery = `srl:${this.table.as.toString()}*${this.table.ss}`;
    this.router.navigate(['home/search'], { queryParams: { query: geoQuery }})
    this.api.addToRecent('search', geoQuery);
  }
  sendQueryIP(): void {
    let ipQuery = `ip:${this.table.ip}`;
    this.router.navigate(['home/search'], { queryParams: { query: ipQuery }})
    this.api.addToRecent('search', ipQuery);
  }

  ngOnInit(): void {
  }

}
