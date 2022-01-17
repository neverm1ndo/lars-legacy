import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { getProcessTranslation } from '../line-process/log-processes';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchResultsComponent implements OnInit {

  @Input('searchResult') chunks: LogLine[][];
  @Input('loading') loading: boolean = true;

  fa = {
    sad: faFrownOpen
  }

  style: string = 'small';

  constructor(
  ) { }

  getProcessTranslation(processname: any) {
    return getProcessTranslation(processname);
  }

  ngOnInit(): void {
    if (localStorage.getItem('settings')) {
      this.style = JSON.parse(localStorage.getItem('settings')).listStyle;
    }
  }

}
