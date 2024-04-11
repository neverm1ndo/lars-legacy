import { State, createReducer, on } from '@ngrx/store';
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
  selectedObject?: number;
}

export const featureKey = 'MapViewer';

const initialState: MapViewerState = {
  currentFile: null,
  mapObjects: [],
  fileTree: null
};

export const logsReducer = createReducer(
  initialState,
  on(mapViewerActions.fetchFileTreeSuccess, (state, { fileTree }) => ({ ...state, fileTree })),
  on(mapViewerActions.fetchMapXMLDocumentSuccess, (state, { mapObjects }) => ({
    ...state,
    mapObjects
  })),
  on(mapViewerActions.changeSelectedObject, (state, { index }) => ({
    ...state,
    selectedObject: index
  })),
  on(mapViewerActions.selectNextObject, (state) => ({
    ...state,
    selectedObject: state.selectedObject + 1
  })),
  on(mapViewerActions.selectPreviousObject, (state) => ({
    ...state,
    selectedObject: state.selectedObject - 1
  })),
  on(mapViewerActions.removeSelectedObject, (state) => {
    const mapObjects = [...state.mapObjects];

    mapObjects.splice(state.selectedObject, 1);

    return { ...state, mapObjects, selectedObject: undefined };
  }),
  on(mapViewerActions.clearObjectsList, (state) => ({
    ...state,
    mapObjects: [],
    currentFile: null
  }))
);
