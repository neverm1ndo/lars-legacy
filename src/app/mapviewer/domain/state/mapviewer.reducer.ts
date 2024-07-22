import { createReducer, on } from '@ngrx/store';
import { MapObject } from '../entities';
import { ITreeNode } from '@lars/interfaces';
import { actions as mapViewerActions } from './mapviewer.actions';

interface MapViewerCurrentFile {
  name: string;
  path: string;
}
export interface MapViewerState {
  currentFile: MapViewerCurrentFile | null;
  mapObjects: MapObject[];
  fileTree: ITreeNode | null;
  selectedObjects?: number[];
}

export const featureKey = 'MapViewer';

const initialState: MapViewerState = {
  currentFile: null,
  mapObjects: [],
  fileTree: null,
  selectedObjects: []
};

export const logsReducer = createReducer(
  initialState,
  on(mapViewerActions.fetchFileTreeSuccess, (state, { fileTree }) => ({ ...state, fileTree })),
  on(mapViewerActions.fetchMapXMLDocumentSuccess, (state, { mapObjects }) => ({
    ...state,
    mapObjects
  })),
  on(mapViewerActions.selectObject, (state, { index }) => ({
    ...state,
    selectedObjects: [...state.selectedObjects, index]
  })),
  on(mapViewerActions.unselectObject, (state, { index }) => {
    const selectedObjects = [...state.selectedObjects].filter(
      (objectIndex) => objectIndex !== index
    );

    return { ...state, selectedObjects };
  }),
  on(mapViewerActions.changeSelectedObject, (state, { index }) => ({
    ...state,
    selectedObjects: [index]
  })),
  on(mapViewerActions.selectNextObject, (state) => ({
    ...state,
    selectedObjects: [state.selectedObjects[0] + 1]
  })),
  on(mapViewerActions.selectPreviousObject, (state) => ({
    ...state,
    selectedObjects: [state.selectedObjects[0] - 1]
  })),
  on(mapViewerActions.removeSelectedObjects, (state) => {
    const mapObjects = [...state.mapObjects]
      .map((object, index) => (state.selectedObjects.includes(index) ? undefined : object))
      .filter((object) => object);

    return { ...state, mapObjects, selectedObjects: [] };
  }),
  on(mapViewerActions.selectMultiple, (state, { indexes }) => ({
    ...state,
    selectedObjects: indexes
  })),
  on(mapViewerActions.clearObjectsList, (state) => ({
    ...state,
    mapObjects: [],
    currentFile: null
  }))
);
