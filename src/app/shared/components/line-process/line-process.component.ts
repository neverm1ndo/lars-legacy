import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import Processes, { Process } from './log-processes';
import { IContentData } from '@lars/interfaces';

@Component({
  selector: 'line-process',
  templateUrl: './line-process.component.html',
  styleUrls: ['./line-process.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineProcessComponent implements OnInit {

  @Input('process') process: string;
  @Input('content') content: IContentData;
  type: Process;

  getProcessTranslation(): Process {
    return Processes[this.process];
  }
  ngOnInit(): void {
    this.type = this.getProcessTranslation();
  }
}
