import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faArrowLeft, faArrowRight, faSync } from '@fortawesome/free-solid-svg-icons';
import { LogsFacade } from '@lars/logs/domain';
import { dateValidator } from '@lars/shared/directives';

@Component({
  selector: 'lars-filter-editor',
  templateUrl: './filter-editor.component.html',
  styleUrls: ['./filter-editor.component.scss']
})
export class FilterEditorComponent implements OnInit {
  public fa = {
    faArrowLeft,
    faArrowRight,
    faSync
  };

  public searchForm = new FormGroup({
    query: new FormControl(''),
    dateFrom: new FormControl('', [dateValidator()]),
    dateTo: new FormControl('', [dateValidator()])
  });

  loading = this.logsFacade.loading$;

  constructor(private readonly logsFacade: LogsFacade) {}

  public goBack() {}
  public goForward() {}
  public send() {}
  public sync() {}

  ngOnInit(): void {}
}
