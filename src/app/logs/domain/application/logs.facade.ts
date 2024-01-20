import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectors as LogsSelectors } from '../state';

@Injectable()
export class LogsFacade {
    constructor(
        private readonly store: Store
    ) {};

    getLogsFilter() {
        return this.store.select(LogsSelectors.selectLogsFilter);
    }

    getLogsList() {
        return this.store.select(LogsSelectors.selectLogsList);
    }
}