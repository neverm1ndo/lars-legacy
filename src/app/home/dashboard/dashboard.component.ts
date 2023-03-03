import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faFolder, faSearch, faSearchPlus, faCloudUploadAlt, faMap, faFileCode, faCalendar } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
     code: faFileCode,
     date: faCalendar,
   }
  constructor() { }

  ngOnInit(): void {
    if (!window.localStorage.getItem('last')) {
      this.last = { search: [], upload: [], files: []};
      window.localStorage.setItem('last', JSON.stringify(this.last));
    }
    this.last = JSON.parse(window.localStorage.getItem('last'));
  }

}
