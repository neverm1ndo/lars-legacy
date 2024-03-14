import { createAction, props } from '@ngrx/store';
import { MapObjectsProp, MapViewerFileTreeProp, SelectedMapObjectIndexProp } from './mapviewer.models';

// file tree actions
const fetchFileTree = createAction('[MapViewer] Fetch file tree');
const fetchFileTreeSuccess = createAction('[MapViewer] Fetch file tree success', props<MapViewerFileTreeProp>());
const fetchFileTreeError = createAction('[MapViewer] Fetch file tree error');

// map actions
const fetchMapXMLDocument = createAction('[MapViewer] Fetch map XML document');
const fetchMapXMLDocumentSuccess = createAction('[MapViewer] Fetch map XML document success', props<MapObjectsProp>());
const fetchMapXMLDocumentError = createAction('[MapViewer] Fetch map XML document error');

const removeSelectedObject = createAction('[MapViewer] Remove selected object from map')
const clearObjectsList = createAction('[MapViewer] Clear objects list')

// control actions
const changeSelectedObject = createAction('[MapViewer] Change selected object', props<SelectedMapObjectIndexProp>());

// file actions
const saveAsXMLMapFileLocally = createAction('[MapViewer] Save map file locally');
const saveAsXMLMapFileLocallySuccess = createAction('[MapViewer] Save map file locally success');
const saveAsXMLMapFileLocallyError = createAction('[MapViewer] Save map file locally error', props<any>());

const saveAsXMLMapOnServer = createAction('[MapViewer] Save map on server');
const saveAsXMLMapOnServerSuccess = createAction('[MapViewer] Save map on server success', props<{ path: string}>());
const saveAsXMLMapOnServerError = createAction('[MapViewer] Save map on server error', props<any>());

const deleteMapFileFromServer = createAction('[MapViewer] Delete map file from server');
const deleteMapFileFromServerSuccess = createAction('[MapViewer] Delete map file from server success', props<{ name: string, path: string }>());
const deleteMapFileFromServerError = createAction('[MapViewer] Delete map file from server error', props<any>());

export const actions = {
    fetchFileTree,
    fetchFileTreeSuccess,
    fetchFileTreeError,
    fetchMapXMLDocument,
    fetchMapXMLDocumentSuccess,
    fetchMapXMLDocumentError,
    removeSelectedObject,
    changeSelectedObject,
    clearObjectsList,
    saveAsXMLMapFileLocally,
    saveAsXMLMapFileLocallySuccess,
    saveAsXMLMapFileLocallyError,
    saveAsXMLMapOnServer,
    saveAsXMLMapOnServerSuccess,
    saveAsXMLMapOnServerError,
    deleteMapFileFromServer,
    deleteMapFileFromServerSuccess,
    deleteMapFileFromServerError,
};