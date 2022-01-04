import { Component, OnInit, Input } from '@angular/core';
import { MapObject } from '../interfaces/map.interfaces';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnInit {

  _objects: MapObject[] = [];
  @Input('mapObjects') set obj (value: MapObject[] ) {
    this._objects = value;
    if (this._objects.length > 20) {
      this.toShow = this.objects.slice(0, 20);
    } else {
      this.toShow = this.objects.map(obj => Object.assign({...obj}));
    }
  };
  get objects() {
     return this._objects;
  }
  toShow: any[] = [];
  page: number = 1;

  constructor() { }

  getCount() {
    return (this.page*20) <= (this._objects.length - this.toShow.length)?20:this._objects.length % 20;
  }

  isObject(name: string): boolean {
    return ((name!=='material') && (name!=='text'))?true:false;
  }

  showOther() {
    this.page++;
    if (this.page*20 < (this.objects.length - this.toShow.length)) {
      this.toShow = this.objects.slice(0, this.toShow.length+20);
    } else {
      this.toShow = this.objects.map(obj => Object.assign({...obj}));
    }

  }

  ngOnInit(): void {}

}
