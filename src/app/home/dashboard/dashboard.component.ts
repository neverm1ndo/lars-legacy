import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faFolder, faSearch, faSearchPlus, faCloudUploadAlt, faMap, faFileCode, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { HistoryListEnum } from '@lars/enums';
import { HistoryStorage } from '@lars/interfaces';

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

   public history: HistoryStorage;

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
    const storedHistory = window.localStorage.getItem('history');
    if (!storedHistory) {
      this.history = {
        [HistoryListEnum.SEARCH]: [], 
        [HistoryListEnum.CONFIGS]: [], 
        [HistoryListEnum.UPLOADS]: [], 
      };
      
      window.localStorage.setItem('history', JSON.stringify(this.history));
    }
    this.history = JSON.parse(storedHistory);
  }

}
