import { Component, OnInit } from "@angular/core";
import { LogsFacade } from "@lars/logs/domain";

@Component({
  selector: "lars-logs-list",
  templateUrl: "./logs-list.component.html",
  styleUrls: ["./logs-list.component.scss"],
})
export class LogsListComponent implements OnInit {
  constructor(
    private logsFacade: LogsFacade
  ) {}

  list$ = this.logsFacade.getLogsList();

  ngOnInit(): void {}
}
