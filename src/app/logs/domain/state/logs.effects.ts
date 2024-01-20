import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { actions as LogsActions } from "./logs.actions";
import { ApiService } from "@lars/api/api.service";
import { combineLatest, switchMap } from "rxjs";
import { UserFacade } from "@lars/user/domain";
import { LogsFacade } from "../application";

@Injectable()
export class LogsEffects {

    constructor(
        private actions$: Actions,
        private api: ApiService,
        private userFacade: UserFacade,
        private logsFacade: LogsFacade
    ) {

    }

    loadLogsItemsEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LogsActions.fetchLogsList),
            switchMap(() => combineLatest([
                this.userFacade.getUserSettings(),
                this.logsFacade.getLogsFilter()
            ])),
            switchMap(
                ([settings, filter]) => this.api.getLogFile('', 0, settings.logs.limit, filter)
            ),
            switchMap((lines) => [LogsActions.loadLogsList({ listItems: lines })])
        )
    );
}

