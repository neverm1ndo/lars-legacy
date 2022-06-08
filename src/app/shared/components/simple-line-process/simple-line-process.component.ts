import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import Processes, { Process, getProcessTranslation } from '../line-process/log-processes';

@Component({
  selector: 'simple-line-process',
  templateUrl: './simple-line-process.component.html',
  styleUrls: ['./simple-line-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleLineProcessComponent implements OnInit {

  @Input('process') process: keyof typeof Processes;
  type: Process;

  constructor() { }

  ngOnInit(): void {
    this.type = getProcessTranslation(this.process);
  }

}
