import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faFilter, faSync } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentNickname = new FormControl('');

  fa = {
    filter: faFilter,
    sync: faSync
  }

  @Output() searchQuery = new EventEmitter<string>();

  constructor(public api: ApiService) { }

  sendQuery(query: string): void {
    console.log(query);

    this.searchQuery.emit(query);
  }

  // refresh()

  ngOnInit(): void {
  }

}
