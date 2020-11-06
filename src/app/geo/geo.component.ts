import { Component, OnInit, Input } from '@angular/core';
import { GeoData } from '../interfaces/app.interfaces';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../api.service';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  @Input('table') table: GeoData;

  fa = { link : faLink };

  constructor(public api: ApiService) { }

  searchSerials(): void {
    this.api.search({ as: this.table.as.toString(), ss: this.table.ss });
  }

  ngOnInit(): void {
  }

}
