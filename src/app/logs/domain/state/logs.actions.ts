import { createAction, props } from '@ngrx/store';
import { LoadLogLineProps } from './logs.models';

const fetchLogsList = createAction('[Logs] Fetch logs list');

const loadLogsList = createAction('[Logs] Load logs list', props<LoadLogLineProps>());

const loadLogsListSuccess = createAction(
  '[Logs] Load logs list success',
  props<LoadLogLineProps>()
);

const loadLogsListError = createAction('[Logs] Load logs list error', props<any>());

const getLogsFilter = createAction('[Logs] Get logs filter');

const loadNextPage = createAction('[Logs] Load next page');

export const actions = {
  fetchLogsList,
  loadLogsList,
  loadLogsListSuccess,
  loadLogsListError,
  getLogsFilter,
  loadNextPage
};
