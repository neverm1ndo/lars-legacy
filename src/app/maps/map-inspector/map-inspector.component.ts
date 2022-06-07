import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MapObject } from '../../interfaces/map.interfaces';
import { faMapSigns } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapInspectorComponent implements OnInit {

  private _objects: MapObject[] = [];
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

  fa = {
    sign: faMapSigns,
  };

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
