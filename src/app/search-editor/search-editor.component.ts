import { Component, OnInit } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { SearchQuery } from '../interfaces/app.interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss']
})
export class SearchEditorComponent implements OnInit {

  lines: LogLine[] = [];
  queryIn: string;

  constructor(
    private api: ApiService,
    public route: ActivatedRoute
  ) { }

  parseSearchQuery(query: string): SearchQuery {
    let result: SearchQuery = {};
    let splited: any[] = [];
    if (query.includes('&')) {
      splited = query.split('&');
    } else {
      splited = [query];
    }
     if ((splited.length > 1) || (splited[0].includes(':'))) {
       result.nickname = [];
       result.ip = [];
       for (let i = 0; i < splited.length; i++) {
         if (splited[i].includes(':')) {
           let q = {
             type : splited[i].split(':')[0],
             val: splited[i].split(':')[1]
           };
           if ((q.type === 'nickname') || (q.type === 'nn')) {
             result.nickname.push(q.val);
           }
           if (q.type === 'ip') {
             result.ip.push(q.val);
           }
           if ((q.type === 'serals') || (q.type === 'srl')) {
             result.as = q.val.split('*')[0];
             result.ss = q.val.split('*')[1];
           }
         } else {
           if (i === 0) {
             result.nickname.push(splited[i]);
           } else if ( i < splited.length - 1 ) {
             result.nickname.push(splited[i]);
           } else {
             result.nickname.push(splited[i]);
           }
         }
       }
     } else {
       result.nickname = [splited[0]];
     }
    for (let key of Object.keys(result)) {
      if (result[key].length === 0) {
        delete result[key];
      }
    }
    console.log(result);
    return result;
  }

  search(query: string): void {
    let sq: SearchQuery = this.parseSearchQuery(query);
    this.api.search(sq).subscribe(
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
      this.api.loading = false;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.query) {
        this.queryIn = params.query;
        this.search(this.queryIn);
      } else {
        this.uber();
      }
    });
    // this.uber();
  }

}
