import { Component, OnInit, Input } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { Processes } from '../line-process/log-processes';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  // chunks: LogLine[][];

  @Input('searchResult') chunks: LogLine[][];

  fa = {
    sad: faFrownOpen
  }

  style: string = 'small';

  constructor(
    public api: ApiService,
    public processes: Processes
  ) { }

  check(process: string): any {
    for (let index = 0; index < this.processes.sched2.length; index++) {
      if (this.processes.sched2[index].process === process) {
        return this.processes.sched2[index];
      }
    }
    return { type: 'warning', translate: 'Неизвестная команда' };
  }

  ngOnInit(): void {
    if (localStorage.getItem('settings')) {
      this.style = JSON.parse(localStorage.getItem('settings')).listStyle;
    }
  }

}
