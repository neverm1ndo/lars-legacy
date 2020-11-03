import { Component, OnInit, Input } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  @Input('searchResult') lines: LogLine[];

  constructor(public api: ApiService) { }

  ngOnInit(): void {
  }

}
