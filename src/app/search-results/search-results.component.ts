import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  _uber: any;

  constructor(
    private api: ApiService
  ) { }

  uber() {
    this.api.getLogFile().subscribe((uber)=> { this._uber = uber });
  }

  ngOnInit(): void {
    this.uber();
  }

}
