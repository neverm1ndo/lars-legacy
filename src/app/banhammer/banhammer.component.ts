import { Component, OnInit } from '@angular/core';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss']
})
export class BanhammerComponent implements OnInit {

  constructor() { }

  searchTypes = [
    { id: 0, val: 'IP' },
    { id: 1, val: 'CN' },
    { id: 2, val: 'AS&SS' },
    { id: 3, val: 'Никнейм' },
    { id: 4, val: 'Время' },
  ];
  currentSearchType: number = 0;

  fa = {
    ban: faUserSlash
  }

  ngOnInit(): void {
  }

}
