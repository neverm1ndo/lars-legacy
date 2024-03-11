import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';

import { actions as mapViewerActions } from "./mapviewer.actions";
import { selectors as mapViewerSelectors } from "./mapviewer.selectors";
import { catchError, filter, map, of, switchMap } from "rxjs";
import { ApiService } from "@lars/api/api.service";
import { Action, Store } from "@ngrx/store";
import { MapViewerService } from "../infrastructure/mapviewer.service";
import { selectQueryParams } from "@lars/state";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";

@Injectable()
export class MapViewerEffects implements OnInitEffects {

    fetchMapsDirectory$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.fetchFileTree),
        switchMap(() => this.api.getMapsDir().pipe(
            map((fileTree) => mapViewerActions.fetchFileTreeSuccess({ fileTree })),
            catchError(() => of(mapViewerActions.fetchFileTreeError()))
        )),
    ));

    fetchMapXMLDocument$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.fetchMapXMLDocument, ROUTER_NAVIGATED),
        switchMap(() => this.store.select(selectQueryParams)),
        filter(({ path }) => path),
        switchMap(({ path }) => this.api.getMap(path).pipe(
            map((xml: string) => this.mapViewerService.mapToObject(xml)),
            map((mapObjects) => mapViewerActions.fetchMapXMLDocumentSuccess({ mapObjects })),
            catchError(() => of(mapViewerActions.fetchFileTreeError()))
        ))
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly api: ApiService,
        private readonly store: Store,
        private mapViewerService: MapViewerService
    ) {}

    ngrxOnInitEffects(): Action {
        return mapViewerActions.fetchFileTree();
    }
}