import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MapObject } from '../map.interfaces';
import { faMapSigns, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { Group, Mesh } from 'three';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapInspectorComponent implements OnInit {

  // public $objects: BehaviorSubject<MapObject[]> = new BehaviorSubject<MapObject[]>([]);
 
  @Input('mapObjects') objects: Group = new Group();
  @Input('selected') selected: Mesh = new Mesh();

  fa = {
    sign: faBoxes,
  };

  constructor() { }

  isObject(name: string): boolean {
    return ((name!=='material') && (name!=='text'))?true:false;
  }

  ngOnInit(): void {
    console.log(this.objects.uuid)
  }

}
