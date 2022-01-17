import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import Processes, { Process } from '../line-process/log-processes';

interface ProcessWithName extends Process {
  name?: keyof typeof Processes | string
}

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  filterForm = new FormGroup((() => { // FIXME: fix form constructor
    let controls = {};
    Object.keys(Processes).forEach((process: string) => {
      controls[Processes[process].control] = new FormControl(true);
    });
    return controls;
  })());

  constructor(
  ) {}

  get processes(): ProcessWithName[] {
    return Object.values(Processes).map((val: ProcessWithName, i: number) => {
      val.name = Object.keys(Processes)[i];
      return val;
    });
  }

  setFilter(): void {
    let changedOpt = this.filterForm.getRawValue();
    localStorage.setItem('filter', JSON.stringify(changedOpt));
  }

  getFilterFromStorage(): void {
    try {
      if (!localStorage.getItem('filter')) throw new Error('EMPTY_FILTER');
      this.filterForm.setValue(JSON.parse(localStorage.getItem('filter')))
    } catch(err) {
      this.setFilter();
      console.warn(err.message, 'Filter reset  to default');
    }
  }

  ngOnInit(): void {
    this.getFilterFromStorage();
  }

}
