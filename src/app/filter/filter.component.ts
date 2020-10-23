import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Processes } from '../line-process/log-processes';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  filterForm = new FormGroup({
   weapBuy: new FormControl(),
   weapPick: new FormControl(),
   armBuy: new FormControl(),
   ammoEnt: new FormControl(),
   ammoLeav: new FormControl(),
   guardBlockOn: new FormControl(),
   guardBlockOff: new FormControl(),
   rconLogTrue: new FormControl(),
   toBackupSave: new FormControl(),
   authIncorrect: new FormControl(),
   authCorrectAdm: new FormControl(),
   authCorrectGue: new FormControl(),
   connect: new FormControl(),
   disconnect: new FormControl(),
   cmdPreproc: new FormControl(),
   cmdPreerrBlock: new FormControl(),
   cmdPreerrNotF: new FormControl(),
   cmdSuccess: new FormControl(),
   pauseStart: new FormControl(),
   pauseEnd: new FormControl(),
   chatMain:new FormControl()
 });

 defaultOptions = {
   weapBuy: true,
   weapPick: true,
   armBuy: true,
   ammoEnt: true,
   ammoLeav: true,
   guardBlockOn: true,
   guardBlockOff: true,
   rconLogTrue: true,
   toBackupSave: true,
   authIncorrect: true,
   authCorrectAdm: true,
   authCorrectGue: true,
   connect: true,
   disconnect: true,
   cmdPreproc: true,
   cmdPreerrBlock: true,
   cmdPreerrNotF: true,
   cmdSuccess: true,
   pauseStart: true,
   pauseEnd: true,
   chatMain:true
 }

 _processes: any[];

  constructor(
    public processes: Processes
  ) {
  }

  setFilter() {
    let changedOpt = this.filterForm.getRawValue();
    window.localStorage.setItem('filter', JSON.stringify(changedOpt));
    // this.options.options.next(changedOpt);
  }

  ngOnInit(): void {
    if (window.localStorage.getItem('filter')) {
    this.filterForm.setValue(JSON.parse(window.localStorage.getItem('filter')))
    } else {
      window.localStorage.setItem('filter', JSON.stringify(this.defaultOptions));
      this.filterForm.setValue(this.defaultOptions);
    }
  }

}
