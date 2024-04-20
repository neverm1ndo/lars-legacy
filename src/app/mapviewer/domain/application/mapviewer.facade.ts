import { Injectable } from '@angular/core';
import { selectors as mapViewerSelectors } from '../state/mapviewer.selectors';
import { actions as mapViewerActions } from '../state/mapviewer.actions';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { ITreeNode } from '@lars/interfaces';
import { selectQueryParams } from '@lars/state';
import { isUndefined } from 'lodash-es';
import { WindowsService } from '@lars/shared/windows';

@Injectable()
export class MapViewerFacade {
  constructor(
    private readonly store: Store,
    private readonly windows: WindowsService
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

  setObjectSelected(index: number) {
    this.store.dispatch(mapViewerActions.selectObject({ index }));
  }

  unselectObject(index: number) {
    this.store.dispatch(mapViewerActions.unselectObject({ index }));
  }

  changeSelectedObjectIndex(index: number) {
    this.store.dispatch(mapViewerActions.changeSelectedObject({ index }));
  }

  getSelectedObjectIndex() {
    return this.store.select(mapViewerSelectors.selectSelectedObjectIndex);
  }

  getSelectedObjectIndexes() {
    return this.store.select(mapViewerSelectors.selectSelectedObjectIndexes);
  }

  selectNext() {
    this.store.dispatch(mapViewerActions.selectNextObject());
  }

  selectPrevious() {
    this.store.dispatch(mapViewerActions.selectPreviousObject());
  }

  selectMultiple(indexes: number[]) {
    this.store.dispatch(mapViewerActions.selectMultiple({ indexes }));
  }

  clearObjects() {
    this.store.dispatch(mapViewerActions.clearObjectsList());
  }

  isSomeObjectSelected() {
    return this.getSelectedObjectIndex().pipe(map((index) => !isUndefined(index)));
  }

  removeObjects() {
    this.store.dispatch(mapViewerActions.removeSelectedObjects());
  }

  commentObject() {
    /** not implemented */
  }

  openInTextEditor(): void {
    this.getCurrentFilePathName()
      .pipe(take(1))
      .subscribe(({ path, name }) => {
        this.windows.open('monitor', `/home/configs/doc?frame=1&path=${path}&name=${name}`);
      });
  }

  saveFileLocally() {
    this.store.dispatch(mapViewerActions.saveAsXMLMapFileLocally());
  }

  saveFileOnServer() {
    this.store.dispatch(mapViewerActions.saveAsXMLMapOnServer());
  }

  deleteMapFromServer() {
    this.store.dispatch(mapViewerActions.deleteMapFileFromServer());
  }
}
