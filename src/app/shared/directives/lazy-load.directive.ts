import { Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { debounceTime, fromEvent, filter, takeUntil } from 'rxjs';

@Directive({
  selector: '[lazyLoad]'
})
export class LazyLoadDirective {

  constructor(
    private _host: ElementRef,
  ) {
    this._scrollEvent$.subscribe({ next: () => {
      this.onBottom.emit(null);
    }});
  }

  private get host() {
    return this._host.nativeElement;
  }

  private _isBottom(): boolean {
    if (this.host.scrollTop !== this.host.scrollHeight - this.host.offsetHeight) {
      return false;
    }
    return true;
  }

  @Output('onBottom') onBottom: EventEmitter<null> = new EventEmitter<null>();

  private _scrollEvent$ = fromEvent(this.host, 'scroll')
                        .pipe(
                          filter(() => this._isBottom()),
                          debounceTime(1200),
                          filter(() => this.host.dataset.listlength % this.host.dataset.limit === 0)
                        );

}
