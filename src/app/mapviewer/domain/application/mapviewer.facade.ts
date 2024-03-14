import { Injectable } from "@angular/core";
import { selectors as mapViewerSelectors } from "../state/mapviewer.selectors";
import { actions as mapViewerActions } from "../state/mapviewer.actions";
import { Store } from "@ngrx/store";
import { Observable, map, take } from "rxjs";
import { ITreeNode } from "@lars/interfaces";
import { selectQueryParams } from "@lars/state";
import { MapObject } from "../entities";
import { isUndefined } from "lodash";

@Injectable()
export class MapViewerFacade {

    constructor(
        private readonly store: Store
    ) {}

    getFileTree(): Observable<ITreeNode | null> {
        return this.store.select(mapViewerSelectors.selectFileTree);
    }

    getCurrentMapObjects() {
        return this.store.select(mapViewerSelectors.selectMapObjects);
    }

    getCurrentFilePathName() {
        return this.store.select(selectQueryParams);
    }

    setSelectedObjectIndex(index: number) {
        this.store.dispatch(mapViewerActions.changeSelectedObject({ index }));
    }

    getSelectedObjectIndex() {
        return this.store.select(mapViewerSelectors.selectSelectedObjectIndex);
    }

    clearObjects() {
        this.store.dispatch(mapViewerActions.clearObjectsList());
    }

    isSomeObjectSelected() {
        return this.getSelectedObjectIndex().pipe(
            map((index) => !isUndefined(index))
        )
    }

    removeObject() {
        this.store.dispatch(mapViewerActions.removeSelectedObject());
    }

    commentObject() {
        /** not implemented */
    }

    openInTextEditor(): void {
        this.getCurrentFilePathName()
            .pipe(take(1))
            .subscribe(({ path, name }) => {
                window.open(`/home/configs/doc?frame=1&path=${path}&name=${name}`, 'monitor', 'minWidth=950');
            });
    }

    saveFileLocally() {
        this.store.dispatch(mapViewerActions.saveAsXMLMapFileLocally());
    }

    saveFileOnServer() {
        this.store.dispatch(mapViewerActions.saveAsXMLMapOnServer());
    }

    deleteMapFromServer() {
        this.store.dispatch(mapViewerActions.deleteMapFileFromServer())
    }
}