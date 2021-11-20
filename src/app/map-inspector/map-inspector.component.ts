import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnInit {

  _objects: { name: string; objects: any[] };
  @Input('mapObjects') set obj (value: { name: string; objects: any[] }) {
    this._objects = value;
    if (this._objects.objects.length > 20) {
      this.toShow = this.objects.objects.slice(0, 20);
    }
  };
  get objects() {
     return this._objects;
  }
  toShow: any[] = [];
  page: number = 1;

  constructor() { }

  getCount() {
    return (this.page*20) <= (this._objects.objects.length - this.toShow.length)?20:this._objects.objects.length % 20;
  }

  isObject(name: string): boolean {
    return ((name!=='material') && (name!=='text'))?true:false;
  }

  showOther() {
    this.page++;
    if (this.page*20 < (this.objects.objects.length - this.toShow.length)) {
      this.toShow = this.objects.objects.slice(0, this.toShow.length+20);
    } else {
      this.toShow = this.objects.objects;
    }

  }

  ngOnInit(): void {}

}
