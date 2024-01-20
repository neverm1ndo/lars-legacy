import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "lars-logs",
  templateUrl: "./logs.component.html",
  styleUrls: ["./logs.component.scss"],
})
export class LogsComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
  ) {
    this.translateService.use("ru");
  }

  ngOnInit(): void {}
}
