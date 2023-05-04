import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle, faVectorSquare, faHistory, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { WebSocketService } from '@lars/web-socket.service';
import { Observable, merge, map, filter, scan } from 'rxjs'
import { dateValidator } from '@lars/shared/directives';
import { HistoryListEnum } from '@lars/enums';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  searchForm = new FormGroup({
    query: new FormControl(''),
    dateFrom: new FormControl('', [
      dateValidator()
    ]),
    dateTo: new FormControl('', [
      dateValidator()
    ])
  });

  fa = {
    filter: faFilter,
    sync: faSync,
    err: faExclamationTriangle,
    vsquare: faVectorSquare,
    hist: faHistory,
    calendar: faCalendarAlt
  }

  public datepickers: boolean = false;

  @Output() searchQuery = new EventEmitter<any>();
  @Output() syncronize = new EventEmitter<boolean>();
  @Input('quick') quick: boolean = false;
  @Input('loading') loading: boolean = true;

  public $newLines: Observable<number> = merge(
    this._ws.getNewLogLines()
            .pipe(map(() => 1)),
    this.syncronize.asObservable()
                   .pipe(map(() => 0)),
  ).pipe(
    scan((acc, val) => val === 0 ? 0 : acc + val, 0),
  );

  constructor(
    private _api: ApiService,
    private _toast: ToastService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _ws: WebSocketService,
  ) { }

  get query() {
    return {
      query: this.searchForm.get('query').value,
      from: this.searchForm.get('dateFrom').value,
      to: this.searchForm.get('dateTo').value
    }
  }

  sendQuery(): void {
    if (this.searchForm.valid) {
      if (this.query.from !== '' && this.query.to !== '') {
        this.searchQuery.emit(this.query);
      } else {
        this.searchQuery.emit({ query: this.query.query });
      }
      if (this.quick) {
        this._router.navigate(['home/search'], {queryParams: { query: this.query.query, lim: '50', page: '0', from: this.query.from, to: this.query.to }})
      }
      this._api.addToRecent(HistoryListEnum.SEARCH, { q: this.query.query, date: Date.now() });
    } else {
      let errmsg = '<b>Ошибка валидации поискового запроса</b><hr>';
      for (let control in this.searchForm.controls) {
        if (!this.searchForm.controls[control].errors) continue;
        errmsg += `<kbd>${control.toUpperCase()}</kbd> Проверьте поле ${control}<br>`
      }
      this._toast.show('danger', errmsg, null, faExclamationTriangle);
    }
  }

  openDatePickers(): void {
    this.datepickers = this.datepickers?true:false;
  }

  sync(): void {
    this.syncronize.emit(true);
  }

  ngOnInit(): void {
    if (this.quick) return;

    this._route.queryParams.pipe(
      filter(({ query }: Params) => query)
    ).subscribe({
      next: ({ query }: Params) => {
        this.searchForm.setValue({ query, dateFrom: '', dateTo: '' });
      }
    });
  }
  
  ngOnDestroy() {
  }

}
