import { createAction, props } from '@ngrx/store';
import { LoadLogLineProps } from './logs.models';

const fetchLogsList = createAction('[Logs] Fetch logs list');

const loadLogsList = createAction('[Logs] Load logs list', props<LoadLogLineProps>());

const getLogsFilter = createAction('[Logs] Get logs filter');

export const actions = {
  fetchLogsList,
  loadLogsList,
  getLogsFilter
};
