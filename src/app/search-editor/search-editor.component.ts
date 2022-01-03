import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { LogLine } from '../interfaces/app.interfaces';
import { ApiService } from '../api.service';
import { UserService } from '../user.service';
import { retryWhen, tap, delay } from 'rxjs/operators';
import { SearchQuery } from '../interfaces/app.interfaces';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { lazy } from '../app.animations';

@Component({
  selector: 'app-search-editor',
  templateUrl: './search-editor.component.html',
  styleUrls: ['./search-editor.component.scss'],
  animations: [lazy]
})
export class SearchEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef<any>;

  lines: number = 0;
  chunks: LogLine[][] = [];
  scroll: any;
  glfSubber: Subscription = new Subscription();
  filter: any;
  loading: boolean = true;

  constructor(
    public api: ApiService,
    public user: UserService,
    public route: ActivatedRoute
  ) {
    const userFilter = JSON.parse(window.localStorage.getItem('filter'));
    this.filter = Object.keys(userFilter).filter((key: string) => userFilter[key] === false);
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

  search(query: any): void {
    let sq: SearchQuery = this.parseSearchQuery(query.query);
    this.chunks = [];
    this.loading = true;
    sq.lim = this.user.getUserSettings().lineChunk.toString();
    this.api.currentPage = 0;
    sq.page = this.api.currentPage.toString();
    if (this.api.lastQuery !== sq) {
      if (sq.dateFrom && sq.dateTo) {
        sq.dateFrom = query.from;
        sq.dateTo = query.to;
      }
      this.api.lastQuery = sq;
      this.api.queryType = 'search';
      this.api.reloader$.next(null);
    }
  }

  refresh(): void {
    this.api.refresh();
  }

  sync(): void {
    this.lines = 0;
    this.chunks = [];
    this.api.sync();
  }

  showLines() {
    this.glfSubber.add(this.api.getLogFile(this.filter).pipe(
      tap(() => {this.loading = true;})
    ).pipe(
      retryWhen(errors =>
        errors.pipe(
          delay(10*1000),
          tap(val => console.log(val))
        ))
      )
      .subscribe((lines: LogLine[])=> {
      if (lines) {
        this.chunks.push(...[lines]);
        this.lines += lines.length;
      }
      if (this.lines > 600) {
        this.lines -= lines.length;
        this.chunks = this.chunks.splice(1, 600/this.user.getUserSettings().lineChunk);
      }
      this.api.lazy = false;
      this.loading = false;
    }));
  }

  isBottom(): boolean {
    if (this.wrapper.nativeElement.scrollTop === this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.offsetHeight) {
      return true;
    }
    return false;
  }
  isTop(): boolean {
    if (this.wrapper.nativeElement.scrollTop === 0) {
      return true;
    }
    return false;
  }

  ngAfterViewInit(): void {
    this.scroll = fromEvent(this.wrapper.nativeElement, 'scroll')
    .pipe(
      debounceTime(1200)
    ).subscribe(() => {
      if (this.isBottom()) {
        if (this.lines % +this.user.getUserSettings().lineChunk == 0) {
          this.api.lazyUpdate(1);
        }
      }
    });
  }

  ngOnInit(): void {
    this.api.currentPage = 0;
    this.glfSubber.add(this.route.queryParams.subscribe(params => {
      this.lines = 0;
      this.chunks = [];
      if (params.query) {
        this.api.queryType = 'search';
        this.api.lastQuery = this.parseSearchQuery(params.query);
        this.showLines();
      } else {
        this.api.queryType = 'last';
        this.showLines();
      }
    }));
  }
  ngOnDestroy(): void {
    if (this.glfSubber) {
      this.glfSubber.unsubscribe();
    }
  }
}
