import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormControl } from '@angular/forms';
import { faCog, faClipboardList, faMap } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  fa = {
    cog: faCog,
    redactor: faClipboardList,
    map: faMap
  };

  // filterForm = new FormGroup({
  //    weapBuy: new FormControl(),
  //    killDeath: new FormControl(),
  //    spawn: new FormControl(),
  //    connection: new FormControl(),
  //    colChange: new FormControl(),
  //    preprocs: new FormControl(),
  //    dateFrom: new FormControl(),
  //    dateTo: new FormControl(),
  //    view: new FormControl(),
  //    litGr: new FormControl(),
  //    litPm: new FormControl(),
  //    idnick:new FormControl(),
  //    cmd:new FormControl()
  //  });

   defaultOptions = {
     weapBuy: true,
     killDeath: false,
     spawn: true,
     connection: false,
     colChange: true,
     preprocs: true,
     dateFrom: true,
     dateTo: true,
     view: true,
     litGr: true,
     litPm: true,
     idnick: true,
     cmd: true
   };

  constructor() {}

  ngOnInit(): void {
    if (window.localStorage.getItem('filter')) {
      // this.filterForm.setValue(JSON.parse(window.localStorage.getItem('filter')))
    } else {
      window.localStorage.setItem('filter', JSON.stringify(this.defaultOptions));
      // this.filterForm.setValue(this.defaultOptions);
    }
  }

}
