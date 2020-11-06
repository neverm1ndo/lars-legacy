import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  @ViewChild('error')
  private error: TemplateRef<any>;

  constructor(
    public api: ApiService,
    public toast: ToastService
  ) { }

  get query() { return this.searchForm.get('query'); }

  sendQuery(): void {
    if (this.searchForm.valid) {
      this.searchQuery.emit(this.query.value);
    } else {
        this.toast.show(this.error, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  // refresh()

  ngOnInit(): void {
  }

}
