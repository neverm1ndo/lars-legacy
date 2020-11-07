import { Component, OnInit, Output, Input, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faFilter, faSync, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../api.service';
import { ToastService } from '../../toast.service';

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
    err: faExclamationTriangle
  }

  @Output() searchQuery = new EventEmitter<string>();
  @Input('quick') quick: boolean = false;
  @Input('queryIn') queryIn: string;

  @ViewChild('error')
  private error: TemplateRef<any>;

  constructor(
    public api: ApiService,
    public toast: ToastService,
    public router: Router
  ) { }

  get query() { return this.searchForm.get('query'); }

  addToRecent(val: string): void {
    let last = JSON.parse(localStorage.getItem('last'));
    if (last.search.length >= 10) {
      last.search.splice(-(last.search.length), 0, val);
      last.search.pop();
    } else {
      last.search.push(val);
    }
    localStorage.setItem('last', JSON.stringify(last));
  }

  sendQuery(): void {
    if (this.searchForm.valid) {
      this.searchQuery.emit(this.query.value);
      if (this.quick) {
        this.router.navigate(['home/search'], {queryParams: { query: this.query.value }})
      }
      this.addToRecent(this.query.value);
    } else {
        this.toast.show(this.error, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  // refresh()

  ngOnInit(): void {
    if (this.queryIn) {
      this.searchForm.setValue({ query: this.queryIn });
    }
  }

}
