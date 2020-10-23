import { Component, OnInit, Input } from '@angular/core';
import { Processes } from './log-processes';

@Component({
  selector: 'line-process',
  templateUrl: './line-process.component.html',
  styleUrls: ['./line-process.component.scss']
})
export class LineProcessComponent implements OnInit {

  @Input('process') process: string;
  @Input('content') content: string;
  type: any;

  constructor(
    public processes: Processes
  ) {}
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
