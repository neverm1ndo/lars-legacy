import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import Processes, { Process } from './log-processes';

@Component({
  selector: 'line-process',
  templateUrl: './line-process.component.html',
  styleUrls: ['./line-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineProcessComponent implements OnInit {

  @Input('process') process: string;
  @Input('content') content: string;
  type: Process;

  constructor(

  ) {}

  getProcessTranslation(): Process {
    return Processes[this.process];
  }
  ngOnInit(): void {
    this.type = this.getProcessTranslation();
  }
}
