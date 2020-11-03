import { Component, OnInit } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { retryWhen, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss']
})
export class SearchEditorComponent implements OnInit {

  lines: LogLine[] = [];

  constructor(private api: ApiService) { }

  search(query: string): void {
    console.log(query);

    this.api.search({ nickname: query }).subscribe(
      (lines: any[]) => { this.lines = lines; this.api.loading = false;}
    );
  }

  refresh(): void {
    this.api.refresh();
  }

  uber() {
    this.api.getLogFile().pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(10*1000),
          tap(val => console.log(val))
        )
      )
    ).subscribe((lines)=> {
      this.lines = lines ;
    }).unsubscribe();
  }

  ngOnInit(): void {
  }

}
