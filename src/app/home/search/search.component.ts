import { Component, OnInit, Output, Input, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle, faVectorSquare, faHistory } from '@fortawesome/free-solid-svg-icons';
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
    ])
  });

  fa = {
    filter: faFilter,
    sync: faSync,
    err: faExclamationTriangle,
    vsquare: faVectorSquare,
    hist: faHistory
  }

  @Output() searchQuery = new EventEmitter<string>();
  @Output() syncronize = new EventEmitter<boolean>();
  @Input('quick') quick: boolean = false;
  @Input('lineCounter') lineCounter: any = 0;

  @ViewChild('error')
  private error: TemplateRef<any>;

  constructor(
    public api: ApiService,
    public toast: ToastService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  get query() { return this.searchForm.get('query'); }

  sendQuery(): void {
    if (this.searchForm.valid) {
      this.searchQuery.emit(this.query.value);
      if (this.quick) {
        this.router.navigate(['home/search'], {queryParams: { query: this.query.value, lim: '50', page: '0' }})
      }
      this.api.addToRecent('search', this.query.value);
    } else {
      this.toast.show(this.error, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  sync(): void {
    this.syncronize.emit(true);
  }

  // refresh()

  ngOnInit(): void {
    // if (this.queryIn) {
    //   this.searchForm.setValue({ query: this.queryIn });
    // }
    this.route.queryParams.pipe(
      filter(params => (params.query))
    ).subscribe(params => {
      this.searchForm.setValue({ query: params.query });
    });
  }

}
