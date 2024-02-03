import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectors as LogsSelectors, actions as LogsActions } from '../state';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LogsFacade {
  constructor(private readonly store: Store) {}

  public readonly currentLogsPage$ = this.store.select(LogsSelectors.selectCurrentLogsPage);

  public readonly loading$ = new BehaviorSubject<boolean>(false);

  getLogsFilter() {
    return this.store.select(LogsSelectors.selectLogsFilter);
  }

  getLogsList() {
    return this.store.select(LogsSelectors.selectLogsList);
  }

  nextPage() {
    return this.store.dispatch(LogsActions.loadNextPage());
  }

  getLast() {
    this.store.dispatch(LogsActions.fetchLogsList());
  }
}
