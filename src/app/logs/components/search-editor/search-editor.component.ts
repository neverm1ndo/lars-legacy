import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { faArrowRight, faArrowLeft, faSync } from "@fortawesome/free-solid-svg-icons";
import { LogsFacade } from "@lars/logs/domain";
import { dateValidator } from "@lars/shared/directives";

@Component({
  selector: "lars-search-editor",
  templateUrl: "./search-editor.component.html",
  styleUrls: ["./search-editor.component.scss"],
})
export class SearchEditorComponent implements OnInit {
  constructor(
  ) {}

  public fa = {
    faArrowLeft,
    faArrowRight,
    faSync,
  };

  public searchForm = new FormGroup({
    query: new FormControl(""),
    dateFrom: new FormControl("", [dateValidator()]),
    dateTo: new FormControl("", [dateValidator()]),
  });

  public goBack() {}
  public goForward() {}
  public send() {}
  public sync() {}

  ngOnInit(): void {}
}
