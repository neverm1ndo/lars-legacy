import { Component, OnInit } from '@angular/core';
import { faGavel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss']
})
export class BanhammerComponent implements OnInit {

  constructor() { }

  fa = {
    gavel: faGavel
  }

  ngOnInit(): void {
  }

}
