import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { retryWhen, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  _uber: any[];

  constructor(
    private api: ApiService
  ) { }

  uber() {
    this.api.getLogFile().pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(10*1000),
          tap(val => console.log(val))
        )
      )
    ).subscribe((uber)=> {
      this._uber = uber ;
      this.api.loading = false;
    });
  }

  ngOnInit(): void {
    this.uber();
  }

}
