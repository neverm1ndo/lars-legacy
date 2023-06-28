import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { MapObject } from '../map.interfaces';
import { faMapSigns, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { Group, Mesh, Object3D } from 'three';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapInspectorComponent implements OnInit, OnChanges {

  // public $objects: BehaviorSubject<MapObject[]> = new BehaviorSubject<MapObject[]>([]);
 
  @Input('mapObjects') objects: any;
  @Input('selected') selectedUUID: string = '';

  fa = {
    sign: faBoxes,
  };

  constructor() { }

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  ngOnInit(): void {
    console.log(this.objects)
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.objects)
  }

}
