import { Injectable } from "@angular/core";
import { selectors as mapViewerSelectors } from "../state/mapviewer.selectors";
import { actions as mapViewerActions } from "../state/mapviewer.actions";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { ITreeNode } from "@lars/interfaces";
import { selectQueryParams } from "@lars/state";
import { MapObject } from "../entities";

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
}