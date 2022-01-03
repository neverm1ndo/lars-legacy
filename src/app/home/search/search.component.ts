import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle, faVectorSquare, faHistory, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../api.service';
import { ToastService } from '../../toast.service';
import { WebSocketService } from '../../web-socket.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchForm = new FormGroup({
    query: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    dateFrom: new FormControl(''),
    dateTo: new FormControl('')
  });

  fa = {
    filter: faFilter,
    sync: faSync,
    err: faExclamationTriangle,
    vsquare: faVectorSquare,
    hist: faHistory,
    calendar: faCalendarAlt
  }
  datepickers: boolean = false;
  filter: boolean = false;
  $newLinesSub: Subscription;
  newLineCounter: number = 0;

  @Output() searchQuery = new EventEmitter<any>();
  @Output() syncronize = new EventEmitter<boolean>();
  @Input('quick') quick: boolean = false;
  @Input('loading') loading: boolean = true;
  @Input('lineCounter') lineCounter: number = 0;

  constructor(
    public api: ApiService,
    public toast: ToastService,
    public router: Router,
    public route: ActivatedRoute,
    public ws: WebSocketService
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
        delete this.query.from;
        delete this.query.to;
        this.searchQuery.emit(this.query);
      }
      if (this.quick) {
        this.router.navigate(['home/search'], {queryParams: { query: this.query.query, lim: '50', page: '0', from: this.query.from, to: this.query.to }})
      }
      this.api.addToRecent('search', this.query.query);
    } else {
      this.toast.show('Поисковой запрос должен состоять не менее, чем из 3-х символов', { classname: 'bg-danger text-light', delay: 3000, icon: faExclamationTriangle });
    }
  }

  openDatePickers(): void {
    this.datepickers = this.datepickers?true:false;
  }
  openFilter(): void {
    this.filter = this.filter?true:false;
  }

  sync(): void {
    this.syncronize.emit(true);
  }

  ngOnInit(): void {
    if (!this.quick) {
      this.$newLinesSub = this.ws.getNewLogLines().subscribe(() => {
        this.newLineCounter++;
      })
    }
    this.route.queryParams.pipe(
      filter(params => (params.query))
    ).subscribe(params => {
      this.searchForm.setValue({ query: params.query, dateFrom: '', dateTo: '' });
    });
  }
  ngOnDestroy() {
    if (this.$newLinesSub) {
      this.$newLinesSub.unsubscribe();
    }
  }

}
