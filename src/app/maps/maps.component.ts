import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { TreeNode } from '../interfaces/app.interfaces';
import { faMap, faPlus, faCloudDownloadAlt, faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor(public api: ApiService) { }

  files: TreeNode;

  fa = {
    map: faMap,
    plus: faPlus,
    down: faCloudDownloadAlt,
    up: faCloudUploadAlt,
    trash: faTrash
  }

  getMaps() {
    this.api.getMapsDir().subscribe(maps => { this.files = maps });
  }

  ngOnInit(): void {
    this.getMaps();
  }

}
