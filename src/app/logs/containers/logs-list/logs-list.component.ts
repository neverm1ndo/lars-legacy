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
import { LIST_ITEM_HEIGHT, LogsFacade } from '@lars/logs/domain';
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

  public preloading = false;

  public readonly itemSize = LIST_ITEM_HEIGHT;

  public list$: Observable<any> = this.logsFacade.getLogsList();

  constructor(private logsFacade: LogsFacade) {}

  loadNewLines() {
    this.spinnerContainer.createEmbeddedView(this.spinnerTemplate);
    this.logsFacade.nextPage();
  }

  ngAfterViewInit(): void {
    this.logsFacade.loading$.pipe(filter((isLoading) => !isLoading)).subscribe({
      next: () => {
        this.spinnerContainer.clear();
      }
    });
  }

  ngOnInit(): void {
    this.logsFacade.getLast();
  }
}
