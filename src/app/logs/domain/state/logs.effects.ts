import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { actions as LogsActions } from './logs.actions';
import { ApiService } from '@lars/api/api.service';
import { catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { UserFacade } from '@lars/user/domain';
import { LogsFacade } from '../application';

@Injectable()
export class LogsEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private userFacade: UserFacade,
    private logsFacade: LogsFacade
  ) {}

  loadLogsItemsEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LogsActions.fetchLogsList, LogsActions.loadNextPage),
      switchMap(() =>
        combineLatest([
          this.userFacade.getUserSettings(),
          this.logsFacade.getLogsFilter(),
          this.logsFacade.currentLogsPage$
        ])
      ),
      tap(() => this.logsFacade.loading$.next(true)),
      switchMap(([settings, filter, page]) =>
        this.api.getLogFile('', page, settings.logs.limit, filter).pipe(
          map((lines) => LogsActions.loadLogsListSuccess({ listItems: lines })),
          catchError(({ message }) => of(LogsActions.loadLogsListError({ message }))),
          tap(() => this.logsFacade.loading$.next(false))
        )
      )
    );
  });
}
