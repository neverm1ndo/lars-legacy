import { Directive, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { debounceTime, fromEvent, filter, withLatestFrom } from 'rxjs';
import { LogsFacade } from '../domain';

@Directive({
  selector: '[larsLazyLoadList]'
})
export class LazyLoadDirective {
  @Output() loadItems: EventEmitter<null> = new EventEmitter<null>();
  @Input() isLoading: boolean;

  constructor(
    private host: ElementRef,
    private logsFacade: LogsFacade
  ) {
    this.scrollEvent$.subscribe({
      next: () => {
        this.loadItems.emit(null);
      }
    });
  }

  private get hostElement(): HTMLElement {
    return this.host.nativeElement as HTMLElement;
  }

  private isBottom(): boolean {
    if (
      this.hostElement.scrollTop !==
      this.hostElement.scrollHeight - this.hostElement.offsetHeight
    ) {
      return false;
    }
    return true;
  }

  private scrollEvent$ = fromEvent(this.hostElement, 'scroll').pipe(
    withLatestFrom(this.logsFacade.loading$),
    filter(([_, isLoading]) => this.isBottom() && !isLoading),
    debounceTime(300),
    filter(
      () =>
        Number(this.hostElement.dataset.listlength) % Number(this.hostElement.dataset.limit) === 0
    )
  );
}
