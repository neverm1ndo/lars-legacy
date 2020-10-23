import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  currentNickname = new FormControl('');

  fa = {
    filter: faFilter
  }

  constructor() { }

  ngOnInit(): void {
  }

}
