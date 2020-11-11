import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { SearchQuery } from '../interfaces/app.interfaces';
import { ActivatedRoute } from '@angular/router';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss']
})
export class SearchEditorComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('wrapper') wrapper: ElementRef<any>;

  lines: LogLine[] = [];
  scroll: any;
  glf$: Observable<any>;
  glf: Subscription;

  constructor(
    private api: ApiService,
    public route: ActivatedRoute
  ) {
    this.glf$ = this.api.getLogFile().pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(10*1000),
          tap(val => console.log(val))
        )));
  }

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
    return result;
  }

  search(query: string): void {
    let sq: SearchQuery = this.parseSearchQuery(query);
    sq.lim = '50';
    sq.page = this.api.currentPage.toString();
    this.api.search(sq).subscribe(
      (lines: any[]) => {
        this.lines = lines;
        this.api.loading = false;
      }
    );
  }

  refresh(): void {
    this.api.refresh();
  }

  uber() {
    this.glf = this.glf$.subscribe((lines)=> {
      if (lines.length) {
        this.lines.push(...lines) ;
      }
      this.api.loading = false;
    });
  }

  isBottom(): boolean {
    if (this.wrapper.nativeElement.scrollTop === this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.offsetHeight) {
      return true;
    }
    return false;
  }

  ngAfterViewInit(): void {
    console.log(this.wrapper);
    this.scroll = fromEvent(this.wrapper.nativeElement, 'scroll')
    .pipe(
      debounceTime(200)
    ).subscribe(() => {
      if (this.isBottom()) {
        if (this.lines.length % 50 == 0) {
          if (this.lines.length >=6) {
            this.api.currentPage++;
          }
          this.api.lazyUpdate();
        }
      }
    });
  }

  ngOnInit(): void {
    console.log(this.api.currentPage);
    this.api.currentPage = 0;
    console.log(this.api.currentPage);
    this.route.queryParams.subscribe(params => {
      if (params.query) {
        this.search(params.query);
      } else {
        this.api.clearLast();
        this.uber();
      }
    });
    // this.uber();
  }
  ngOnDestroy(): void {
    if (this.glf) this.glf.unsubscribe();
  }
}
