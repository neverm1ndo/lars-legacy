import { Component, OnInit } from '@angular/core';
import { LogsFacade } from '@lars/logs/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'lars-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit {
  public list$: Observable<any> = this.logsFacade.getLogsList();

  constructor(private logsFacade: LogsFacade) {}

  ngOnInit(): void {
    this.logsFacade.getLast();
  }
}
