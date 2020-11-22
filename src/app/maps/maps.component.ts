import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { faMap, faPlus, faCloudDownloadAlt, faCloudUploadAlt, faTrash, faCheckCircle, faInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor(public api: ApiService) { }

  files: TreeNode;

  current: any;

  fa = {
    map: faMap,
    plus: faPlus,
    down: faCloudDownloadAlt,
    up: faCloudUploadAlt,
    trash: faTrash,
    check: faCheckCircle,
    info: faInfo
  }

  parseMap(xml: string): { objects: number, coords: { x: string | null, y: string | null, z: string | null }, dim?: string | null, int?: string | null } {
    let parser = new DOMParser();
    console.log(xml);

    let map = parser.parseFromString(xml.replace('edf:definitions="editor_main"', ''), 'text/xml');

    let firstobj = map.getElementsByTagName("object")[0];
    return {
      objects: Math.floor(map.getElementsByTagName('map')[0].childNodes.length/2),
      coords: {
        x: firstobj.getAttribute('posX'),
        y: firstobj.getAttribute('posY'),
        z: firstobj.getAttribute('posZ'),
      },
      dim: firstobj.getAttribute('dimension'),
      int: firstobj.getAttribute('interior')
    };
  }

  getMaps() {
    this.api.getMapsDir().subscribe(maps => { this.files = maps });
  }

  getMap(path: { path: string, name?: string}) {
    this.api.getMap(path.path).subscribe(map => { this.current = this.parseMap(map); this.current.name = path.name })
  }

  ngOnInit(): void {
    this.getMaps();
  }

}
