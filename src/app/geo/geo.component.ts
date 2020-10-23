import { Component, OnInit, Input } from '@angular/core';
import { GeoData } from '../interfaces/app.interfaces';

@Component({
  selector: 'geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnInit {

  @Input('table') table: GeoData;

  constructor() { }

  ngOnInit(): void {
  }

}
