import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnInit {

  @Input('mapObjects') objects: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
