import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'map-inspector',
  templateUrl: './map-inspector.component.html',
  styleUrls: ['./map-inspector.component.scss']
})
export class MapInspectorComponent implements OnInit {

  @Input('mapObjects') objects: { name: string; objects: any[] };
  toShow: any[] = [];
  page: number = 1;

  constructor() { }

  getCount() {
    return (this.page*20) <= (this.objects.objects.length - this.toShow.length)?20:this.objects.objects.length - this.toShow.length
  }

  showOther() {
    this.page++;
    if (this.page*20 < (this.objects.objects.length - this.toShow.length)) {
      this.toShow = this.objects.objects.splice(0, 20*this.page);
    } else {
      this.toShow = this.objects.objects;
    }
  }

  ngOnInit(): void {
    if (this.objects.objects.length > 20) {
      this.toShow = this.objects.objects.splice(0, 20);
    }
  }

}
