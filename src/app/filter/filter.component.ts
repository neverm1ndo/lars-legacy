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
