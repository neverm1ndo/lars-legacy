import { Injectable } from "@angular/core";
import { selectors as mapViwerSelectors } from "../state/mapviewer.selectors";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { ITreeNode } from "@lars/interfaces";
import { selectQueryParams } from "@lars/state";

@Injectable()
export class MapViewerFacade {

    constructor(
        private readonly store: Store
    ) {}

    getFileTree(): Observable<ITreeNode | null> {
        return this.store.select(mapViwerSelectors.selectFileTree);
    }

    getCurrentMapObjects() {
        return this.store.select(mapViwerSelectors.selectMapObjects);
    }

    getCurrentFilePathName() {
        return this.store.select(selectQueryParams);
    }
}