import { Component, OnInit } from '@angular/core';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-empty-doc',
  templateUrl: './empty-doc.component.html',
  styleUrls: ['./empty-doc.component.scss']
})
export class EmptyDocComponent implements OnInit {

  constructor() { }

  fa = faFileSignature;

  ngOnInit(): void {
  }

}
