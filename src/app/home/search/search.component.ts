import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle, faVectorSquare, faHistory, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '@lars/api.service';
import { ToastService } from '@lars/toast.service';
import { WebSocketService } from '@lars/web-socket.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs'
import { dateValidator } from '@lars/shared/directives';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
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
  private $newLinesSub: Subscription;
  public newLineCounter: number = 0;

  @Output() searchQuery = new EventEmitter<any>();
  @Output() syncronize = new EventEmitter<boolean>();
  @Input('quick') quick: boolean = false;
  @Input('loading') loading: boolean = true;
  @Input('lineCounter') lineCounter: number = 0;

  constructor(
    private _api: ApiService,
    private _toast: ToastService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _ws: WebSocketService
  ) { }

  get query() {
    return {
      query: this.searchForm.get('query').value,
      from: this.searchForm.get('dateFrom').value,
      to: this.searchForm.get('dateTo').value
    }
  }

  // get lazy() {
  //   return this._api.lazy;
  // }

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
      this._api.addToRecent('search', this.query.query);
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
    // this._api.currentPage = 0;
    this.syncronize.emit(true);
  }

  ngOnInit(): void {
    if (!this.quick) {
      this.$newLinesSub = this._ws.getNewLogLines()
                                  .subscribe(() => {
                                    this.newLineCounter++;
                                  });
    }
    this._route.queryParams.pipe(
      filter(({ query }: Params) => query)
    ).subscribe({
      next: ({ query }: Params) => {
        this.searchForm.setValue({ query, dateFrom: '', dateTo: '' });
      }
    });
  }

  ngOnDestroy() {
    if (this.$newLinesSub) this.$newLinesSub.unsubscribe();
  }
}
