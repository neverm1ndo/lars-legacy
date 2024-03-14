import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';

import { actions as mapViewerActions } from "./mapviewer.actions";
import { selectors as mapViewerSelectors } from "./mapviewer.selectors";
import { catchError, filter, from, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { ApiService } from "@lars/api/api.service";
import { Action, Store } from "@ngrx/store";
import { MapViewerService } from "../infrastructure/mapviewer.service";
import { selectQueryParams, selectQueryParam } from "@lars/state";
import { ROUTER_NAVIGATED } from "@ngrx/router-store";
import { ElectronService } from "@lars/core/services";
import { MessageBoxReturnValue, SaveDialogReturnValue } from "electron";
import { ToastService } from "@lars/toast.service";
import { HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";

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
            catchError(() => of(mapViewerActions.fetchMapXMLDocumentError()))
        ))
    ));

    saveMapXMLDocumentLocally$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.saveAsXMLMapFileLocally),
        withLatestFrom(
            this.store.select(mapViewerSelectors.selectMapObjects),
            this.store.select(selectQueryParam('name')),
        ),
        map(([, objects, name]) => ([
            this.mapViewerService.mapObjectsToXML(objects), 
            name
        ])),
        switchMap(
            ([xmlDocument, name]: [XMLDocument, string]) => from(
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
                            this.mapViewerService.serializePrettyXML(xmlDocument)
                        )
                    )
                ),
                map(() => mapViewerActions.saveAsXMLMapFileLocallySuccess()),
            )
        ),
        catchError((err) => of(mapViewerActions.saveAsXMLMapFileLocallyError(err)))
    ));

    saveMapXMLDocumentLocallySuccess$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.saveAsXMLMapFileLocallySuccess),
            withLatestFrom(this.store.select(selectQueryParams)),
            tap(([, { name, path }]) => this.toast.show('success', `Файл ${name} сохранен`, path))
        ),
        { dispatch: false }
    );

    saveMapXMLDocumentLocallyError$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.saveAsXMLMapFileLocallyError),
            withLatestFrom(this.store.select(selectQueryParam('name'))),
            tap(([err, name]) => this.toast.show('danger', `Файл ${name} не был сохранен сохранен`, err))
        ),
        { dispatch: false }
    );

    deleteMap$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.deleteMapFileFromServer),
        withLatestFrom(this.store.select(selectQueryParams)),
        switchMap(
            ([, { name, path }]) => from(
                    this.electron.ipcRenderer.invoke('message-box',
                        {
                            type: 'warning',
                            buttons: ['Отмена', 'Удалить'],
                            title: `Подтверждение удаления`,
                            message: `Вы точно хотите удалить карту ${path}? После подтверждения она будет безвозвратно удалена с сервера.`
                        }
                    )
                ).pipe(
                    filter((val: MessageBoxReturnValue) => val.response === 1),
                    switchMap(() => this.api.deleteMap(path)),
                    map(() => mapViewerActions.deleteMapFileFromServerSuccess({ name, path })),
                    catchError((err) => of(mapViewerActions.deleteMapFileFromServerError(err)))
                )
            )
        ),
    );

    deleteMapSuccess$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.deleteMapFileFromServerSuccess),
            tap(({ name, path }) => { 
                this.toast.show('success', `Файл ${name} удален с сервера`, path);

                this.router.navigate(['/home/maps']);
            })
        ),
        { dispatch: false }
    );

    deleteMapError$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.deleteMapFileFromServerError),
            tap((err) => this.toast.show('danger', `Файл не был удален с сервера`, err.message))
        ),
        { dispatch: false }
    );

    saveXMLDocumentOnServer$ = createEffect(() => this.actions$.pipe(
        ofType(mapViewerActions.saveAsXMLMapOnServer),
        withLatestFrom(
            this.store.select(mapViewerSelectors.selectMapObjects),
            this.store.select(selectQueryParam('path')),
        ),
        map(([, objects, path]) => ([
            this.mapViewerService.mapObjectsToXML(objects), 
            path
        ])),
        switchMap(
            ([xmlDocument, path]: [XMLDocument, string]) => from(this.electron.ipcRenderer.invoke('message-box', {
                type: 'warning',
                buttons: ['Отмена', 'Сохранить'],
                title: `Подтверждение сохранения на сервере`,
                message: `Вы точно хотите сохранить карту ${path}? После подтверждения она будет перезаписана на сервере.`
              })
            ).pipe(
                filter((val: MessageBoxReturnValue) => val.response === 1),
                map(() => {
                    const form: FormData = new FormData();

                    const xmlDocumentAsString: string = this.mapViewerService.serializePrettyXML(xmlDocument);

                    const blob: Blob = new Blob([xmlDocumentAsString], { type: 'application/xml' });
                    form.append('file', blob, path);

                    return form;
                  }
                ),
                switchMap((form: FormData) => this.api.uploadFileMap(form)),
                filter((event) => event instanceof HttpResponse),
                map(() => mapViewerActions.saveAsXMLMapOnServerSuccess({ path })),
                catchError((err) => of(mapViewerActions.saveAsXMLMapOnServerError(err)))
            )
        ),
    ));

    saveXMLDocumentOnServerSuccess$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.saveAsXMLMapOnServerSuccess),
            tap(({ path }) => this.toast.show('success', `Файл сохранен на сервере`, path))
        ),
        { dispatch: false }
    );

    saveXMLDocumentOnServerError$ = createEffect(
        () => this.actions$.pipe(
            ofType(mapViewerActions.saveAsXMLMapOnServerError),
            tap((err) => this.toast.show('danger', `Файл не был сохранен на сервере`, err.message))
        ),
        { dispatch: false }
    );

    constructor(
        private readonly actions$: Actions,
        private readonly api: ApiService,
        private readonly store: Store,
        private mapViewerService: MapViewerService,
        private electron: ElectronService,
        private toast: ToastService,
        private router: Router
    ) {}

    ngrxOnInitEffects(): Action {
        return mapViewerActions.fetchFileTree();
    }
}