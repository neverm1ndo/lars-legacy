import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapInspectorComponent implements OnInit{

  public $objects: Subject<THREE.Group> = new Subject<THREE.Group>();
 
  public $selectedUUID: Subject<string> = new Subject();

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter();

  fa = {
    sign: faBoxes,
  };

  constructor() { }

  isObject(name: string): boolean {
    return name !== 'material' && name !== 'text';
  }

  select(object: THREE.Object3D): void {
    this.onSelect.emit(object.children[0]);
  }

  ngOnInit(): void {
  }

}
