import { Component, OnInit } from '@angular/core';
import { faFolder, faSearch, faSearchPlus, faCloudUploadAlt, faMap, faFileCode } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  help: boolean = true;
   license: boolean;
   innerHeight: number;
   version: string = '1.0';

   last: any;

   fa = {
     dir: faFolder,
     search: faSearch,
     searchp: faSearchPlus,
     up: faCloudUploadAlt,
     map: faMap,
     code: faFileCode
   }
  constructor() { }

  ngOnInit(): void {
    if (!localStorage.getItem('last')) {
      this.last = { search: [], upload: [], files: []};
      localStorage.setItem('last', JSON.stringify(this.last));
    }
    this.last = JSON.parse(localStorage.getItem('last'));
  }

}
