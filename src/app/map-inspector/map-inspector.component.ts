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
    return (this.page*20) <= (this._objects.objects.length - this.toShow.length)?20:this._objects.objects.length - this.toShow.length
  }

  showOther() {
    this.page++;
    if (this.page*20 < (this._objects.objects.length - this.toShow.length)) {
      this.toShow = this._objects.objects.splice(0, 20*this.page);
    } else {
      this.toShow = this._objects.objects;
    }
  }

  ngOnInit(): void {
  }

}
