import { Component, OnInit, Input } from '@angular/core';
import { Processes } from '../line-process/log-processes';

@Component({
  selector: 'simple-line-process',
  templateUrl: './simple-line-process.component.html',
  styleUrls: ['./simple-line-process.component.scss']
})
export class SimpleLineProcessComponent implements OnInit {

  @Input('process') process: string;
  type: any;

  constructor(public processes: Processes ) { }

  check(process: string): any {
    for (let index = 0; index < this.processes.sched2.length; index++) {
      if (this.processes.sched2[index].process === process) {
        return this.processes.sched2[index];
      }
    }
    return { type: 'warning', translate: 'Неизвестная команда' };
  }

  ngOnInit(): void {
    this.type = this.check(this.process);
  }

}
