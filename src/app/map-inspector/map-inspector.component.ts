import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnInit {

  _objects: { name: string; objects: any[] };
  @Input('mapObjects') set objects (value: { name: string; objects: any[] }) {
    this._objects = value;
    if (this._objects.objects.length > 20) {
      this.toShow = this._objects.objects.splice(0, 20);
    }
  };
  get objects() {
     return this._objects;
  }
  toShow: any[] = [];
  page: number = 1;

  constructor() { }

  getCount() {
    return (this.page*20) <= (this._objects.objects.length - this.toShow.length)?20:this._objects.objects.length - this.toShow.length;
  }

  isObject(name: string): boolean {
    return ((name!=='material') && (name!=='text'))?true:false;
  }

  showOther() {
    this.page++;
    let o = this._objects.objects;
    if (this.page*20 < (this.objects.objects.length - this.toShow.length)) {
      this.toShow = o.splice(0, this.toShow.length+20);
    } else {
      this.toShow = this.objects.objects;
    }
  }

  ngOnInit(): void {}

}
