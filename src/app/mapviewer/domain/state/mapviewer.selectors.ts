import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MapViewerState, featureKey } from './mapviewer.reducer';

const userSelectFeature = createFeatureSelector<MapViewerState>(featureKey);

const selectFileTree = createSelector(userSelectFeature, (state) => state.fileTree);
const selectCurrentFile = createSelector(userSelectFeature, (state) => state.currentFile);
const selectMapObjects = createSelector(userSelectFeature, (state) => state.mapObjects);
const selectSelectedObjectIndex = createSelector(userSelectFeature, (state) => state.selectedObject);

export const selectors = {
  selectFileTree,
  selectCurrentFile,
  selectMapObjects,
  selectSelectedObjectIndex,
};