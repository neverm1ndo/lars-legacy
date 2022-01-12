import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { Processes } from '../line-process/log-processes';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {

  @Input('searchResult') chunks: LogLine[][];
  @Input('loading') loading: boolean = true;

  fa = {
    sad: faFrownOpen
  }

  style: string = 'small';

  constructor(
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
