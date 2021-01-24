import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle, faVectorSquare, faHistory, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../api.service';
import { ToastService } from '../../toast.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchForm = new FormGroup({
    query: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    dateFrom: new FormControl(),
    dateTo: new FormControl()
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

  @Output() searchQuery = new EventEmitter<any>();
  @Output() syncronize = new EventEmitter<boolean>();
  @Input('quick') quick: boolean = false;
  @Input('lineCounter') lineCounter: number = 0;

  constructor(
    public api: ApiService,
    public toast: ToastService,
    public router: Router,
    public route: ActivatedRoute
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
      console.log('lol')
      this.searchQuery.emit(this.query);
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

  sync(): void {
    this.syncronize.emit(true);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      filter(params => (params.query))
    ).subscribe(params => {
      this.searchForm.setValue({ query: params.query });
    });
  }

}
