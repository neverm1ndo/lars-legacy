import { Component, OnInit, Input } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  @Input('searchResult') lines: LogLine[];

  fa = {
    sad: faFrownOpen
  }

  style: string = 'small';

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    if (window.localStorage.getItem('settings')) {
      this.style = JSON.parse(window.localStorage.getItem('settings')).listStyle;
    }
  }

}
