import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Processes } from '../line-process/log-processes';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  filterForm = new FormGroup((() => {
    let controls = {};
    this.processes.sched2.forEach(process => {
      controls[process.control] = new FormControl(true);
    });
    return controls;
  })());
 //  filterForm = new FormGroup({
 //   weapBuy: new FormControl(true),
 //   weapPick: new FormControl(true),
 //   armBuy: new FormControl(true),
 //   ammoEnt: new FormControl(true),
 //   ammoLeav: new FormControl(true),
 //   guardBlockOn: new FormControl(true),
 //   guardBlockOff: new FormControl(true),
 //   rconLogTrue: new FormControl(true),
 //   toBackupSave: new FormControl(true),
 //   authIncorrect: new FormControl(true),
 //   authCorrectAdm: new FormControl(true),
 //   authCorrectGue: new FormControl(true),
 //   connect: new FormControl(true),
 //   disconnect: new FormControl(true),
 //   cmdPreproc: new FormControl(true),
 //   cmdPreerrBlock: new FormControl(true),
 //   cmdPreerrNotF: new FormControl(true),
 //   cmdSuccess: new FormControl(true),
 //   pauseStart: new FormControl(true),
 //   pauseEnd: new FormControl(true),
 //   chatMain:new FormControl(true),
 //   chatBlock:new FormControl(true),
 //   disconnectTimeout:new FormControl(true),
 //   toBackupLoad:new FormControl(true),
 //   chatHandUnBlock:new FormControl(true),
 //   chatHandBlock:new FormControl(true),
 //   devWeap:new FormControl(true),
 //   devVeh:new FormControl(true),
 //   spectateChange:new FormControl(true),
 //   spectateEnter:new FormControl(true),
 //   spectateLeave:new FormControl(true),
 //   checkExpl:new FormControl(true),
 // });

 _processes: any[];

  constructor(
    public processes: Processes
  ) {}

  setFilter() {
    let changedOpt = this.filterForm.getRawValue();
    localStorage.setItem('filter', JSON.stringify(changedOpt));
  }

  ngOnInit(): void {
    if (localStorage.getItem('filter')) {
      this.filterForm.setValue(JSON.parse(localStorage.getItem('filter')))
    } else {
      this.setFilter();
    }
  }

}
