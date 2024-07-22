import { createAction, props } from '@ngrx/store';
import {
  MapObjectsProp,
  MapViewerFileTreeProp,
  MultiSelectedMapObjectIndexesProp,
  SelectedMapObjectIndexProp
} from './mapviewer.models';

// file tree actions
const fetchFileTree = createAction('[MapViewer] Fetch file tree');
const fetchFileTreeSuccess = createAction(
  '[MapViewer] Fetch file tree success',
  props<MapViewerFileTreeProp>()
);
const fetchFileTreeError = createAction('[MapViewer] Fetch file tree error');

// map actions
const fetchMapXMLDocument = createAction('[MapViewer] Fetch map XML document');
const fetchMapXMLDocumentSuccess = createAction(
  '[MapViewer] Fetch map XML document success',
  props<MapObjectsProp>()
);
const fetchMapXMLDocumentError = createAction('[MapViewer] Fetch map XML document error');

const removeSelectedObjects = createAction('[MapViewer] Remove selected objects from map');
const clearObjectsList = createAction('[MapViewer] Clear objects list');

// control actions
const selectObject = createAction('[MapViewer] Select object', props<SelectedMapObjectIndexProp>());
const unselectObject = createAction(
  '[MapViewer] Unselect object',
  props<SelectedMapObjectIndexProp>()
);
const changeSelectedObject = createAction(
  '[MapViewer] Change selected object',
  props<SelectedMapObjectIndexProp>()
);
const selectNextObject = createAction('[MapViewer] Select next object');
const selectPreviousObject = createAction('[MapViewer] Select previous object');
const selectMultiple = createAction(
  '[MapViewer] Select multiple objects',
  props<MultiSelectedMapObjectIndexesProp>()
);

// file actions
const saveAsXMLMapFileLocally = createAction('[MapViewer] Save map file locally');
const saveAsXMLMapFileLocallySuccess = createAction('[MapViewer] Save map file locally success');
const saveAsXMLMapFileLocallyError = createAction(
  '[MapViewer] Save map file locally error',
  props<any>()
);

const saveAsXMLMapOnServer = createAction('[MapViewer] Save map on server');
const saveAsXMLMapOnServerSuccess = createAction(
  '[MapViewer] Save map on server success',
  props<{ path: string }>()
);
const saveAsXMLMapOnServerError = createAction(
  '[MapViewer] Save map on server error',
  props<any>()
);

const deleteMapFileFromServer = createAction('[MapViewer] Delete map file from server');
const deleteMapFileFromServerSuccess = createAction(
  '[MapViewer] Delete map file from server success',
  props<{ name: string; path: string }>()
);
const deleteMapFileFromServerError = createAction(
  '[MapViewer] Delete map file from server error',
  props<any>()
);

export const actions = {
  fetchFileTree,
  fetchFileTreeSuccess,
  fetchFileTreeError,
  fetchMapXMLDocument,
  fetchMapXMLDocumentSuccess,
  fetchMapXMLDocumentError,
  removeSelectedObjects,
  changeSelectedObject,
  selectObject,
  unselectObject,
  selectNextObject,
  selectPreviousObject,
  selectMultiple,
  clearObjectsList,
  saveAsXMLMapFileLocally,
  saveAsXMLMapFileLocallySuccess,
  saveAsXMLMapFileLocallyError,
  saveAsXMLMapOnServer,
  saveAsXMLMapOnServerError,
  saveAsXMLMapOnServerSuccess,
  deleteMapFileFromServerSuccess,
  deleteMapFileFromServer,
  deleteMapFileFromServerError
};
