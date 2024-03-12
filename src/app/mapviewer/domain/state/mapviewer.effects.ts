import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';

import { actions as mapViewerActions } from "./mapviewer.actions";
import { selectors as mapViewerSelectors } from "./mapviewer.selectors";
import { catchError, combineLatest, filter, from, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { ApiService } from "@lars/api/api.service";
import { Action, Store } from "@ngrx/store";
import { MapViewerService } from "../infrastructure/mapviewer.service";
import { selectQueryParams, selectQueryParam } from "@lars/state";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";
import { ElectronService } from "@lars/core/services";
import { SaveDialogReturnValue } from "electron";

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

    saveMapXMLDocumentLocally$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.saveAsXMLMapFileLocally),
        switchMap(() => combineLatest([
            this.store.select(mapViewerSelectors.selectMapObjects),
            this.store.select(selectQueryParam('name')),
        ])),
        tap(([objects]) => console.log(this.mapViewerService.mapObjectsToXML(objects))),
        map(([objects, name]) => ([
            this.mapViewerService.mapObjectsToXML(objects), 
            name
        ])),
        tap(console.log),
        // catchError((err) => of(mapViewerActions.saveAsXMLMapFileLocallyError(err))),
        switchMap(
            ([xmlDocument, name]) => from(
                this.electron.ipcRenderer.invoke('save-dialog', {
                    title: 'Сохранить карту как',
                    buttonLabel: 'Сохранить',
                    defaultPath: name,
                    filters: [
                      { name: 'Maps(*.map, *.map.off)', extensions: ['map', 'off'] },
                      { name: 'All Files', extensions: ['*'] }
                    ],
                })
            ).pipe(
                filter((res: SaveDialogReturnValue) => res.filePath && !res.canceled),
                switchMap(
                    (res) => from(
                        this.electron.fs.promises.writeFile(
                            res.filePath,
                            xmlDocument.toString()
                        )
                    )
                )
            )
        ),
        map(() => mapViewerActions.saveAsXMLMapFileLocallySuccess()),
        catchError((err) => of(mapViewerActions.saveAsXMLMapFileLocallyError(err)))
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly api: ApiService,
        private readonly store: Store,
        private mapViewerService: MapViewerService,
        private electron: ElectronService
    ) {}

    ngrxOnInitEffects(): Action {
        return mapViewerActions.fetchFileTree();
    }
}