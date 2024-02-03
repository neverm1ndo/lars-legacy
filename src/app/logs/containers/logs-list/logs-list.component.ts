import { CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { LogsFacade } from '@lars/logs/domain';
import { takeWhile } from 'lodash';
import { Observable, debounceTime, filter, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'lars-logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit, AfterViewInit {
  @ViewChild('spinnerContainer', { static: true, read: ViewContainerRef })
  spinnerContainer: ViewContainerRef;
  @ViewChild('lazyLoaderSpinner') spinnerTemplate: TemplateRef<any>;
  @ViewChildren('viewport') viewport: ElementRef;

  public preloading = false;

  public list$: Observable<any> = this.logsFacade.getLogsList();

  constructor(private logsFacade: LogsFacade) {}

  loadNewLines() {
    this.spinnerContainer.createEmbeddedView(this.spinnerTemplate);

    // console.log(this.preloading);

    // if (this.preloading) {
    this.logsFacade.nextPage();
    // }

    // this.preloading = true;
  }

  ngAfterViewInit(): void {
    this.logsFacade.loading$.pipe(filter((isLoading) => !isLoading)).subscribe({
      next: (isLoading) => {
        // console.log(isLoading);
        // this.preloading = false;
        this.spinnerContainer.clear();
      }
    });
  }

  ngOnInit(): void {
    this.logsFacade.getLast();
  }
}
