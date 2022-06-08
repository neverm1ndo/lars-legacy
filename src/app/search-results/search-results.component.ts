import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { getProcessTranslation } from '../shared/components/line-process/log-processes';

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

  isBanned(processname: any) {
    const banned = ['<disconnect/ban>', '<disconnect/kick>'];
    return banned.includes(processname);
  }

  getProcessTranslation(processname: any) {
    return getProcessTranslation(processname);
  }

  ngOnInit(): void {
    this.chunks = [[]];
    if (window.localStorage.getItem('settings')) this.style = JSON.parse(window.localStorage.getItem('settings')).listStyle;
  }

}
