import { ITreeNode } from '@lars/interfaces';
import { createAction, props } from '@ngrx/store';
import { MapObjectsProp, MapViewerFileTreeProp } from './mapviewer.models';
// import { LoadLogLineProps } from './logs.models';

// const fetchLogsList = createAction('[Logs] Fetch logs list');

// const loadLogsList = createAction('[Logs] Load logs list', props<LoadLogLineProps>());

// const loadLogsListSuccess = createAction(
//   '[Logs] Load logs list success',
//   props<LoadLogLineProps>()
// );

// const loadLogsListError = createAction('[Logs] Load logs list error', props<any>());

// const getLogsFilter = createAction('[Logs] Get logs filter');

// const loadNextPage = createAction('[Logs] Load next page');

// file tree actions
const fetchFileTree = createAction('[MapViewer] Fetch file tree');
const fetchFileTreeSuccess = createAction('[MapViewer] Fetch file tree success', props<MapViewerFileTreeProp>());
const fetchFileTreeError = createAction('[MapViewer] Fetch file tree error');

// map actions
const fetchMapXMLDocument = createAction('[MapViewer] Fetch map XML document');
const fetchMapXMLDocumentSuccess = createAction('[MapViewer] Fetch map XML document success', props<MapObjectsProp>());
const fetchMapXMLDocumentError = createAction('[MapViewer] Fetch map XML document error');

// const getMapObjects = createAction('[MapViewer')

export const actions = {
    fetchFileTree,
    fetchFileTreeSuccess,
    fetchFileTreeError,
    fetchMapXMLDocument,
    fetchMapXMLDocumentSuccess,
    fetchMapXMLDocumentError,
//   fetchLogsList,
//   loadLogsList,
//   loadLogsListSuccess,
//   loadLogsListError,
//   getLogsFilter,
//   loadNextPage
};