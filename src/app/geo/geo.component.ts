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
    this.api.currentPage = 0;
    let geoQuery = `srl:${this.table.as.toString()}*${this.table.ss}`;
    this.api.addToRecent('search', geoQuery);
    this.router.navigate(['home/search'], { queryParams: { query: geoQuery }})
  }
  sendQueryIP(): void {
    this.api.currentPage = 0;
    let ipQuery = `ip:${this.table.ip}`;
    this.api.addToRecent('search', ipQuery);
    this.router.navigate(['home/search'], { queryParams: { query: ipQuery }})
  }

  ngOnInit(): void {
  }

}
