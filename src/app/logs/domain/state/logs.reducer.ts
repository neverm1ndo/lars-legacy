import { State, createReducer, on } from '@ngrx/store';
import { actions as LogsActions } from './logs.actions';
import { LogLine } from '../entities';

export interface LogsState {
  listItems: LogLine[];
  filter: string[];
  loading: boolean;
  currentPage: number;
}

export const featureKey = 'Logs';

const initialState: LogsState = {
  listItems: [],
  filter: [],
  loading: true,
  currentPage: 0
};

export const logsReducer = createReducer(
  initialState,
  on(
    LogsActions.loadLogsListSuccess,
    (state, { listItems }): LogsState => ({
      ...state,
      listItems: [...state.listItems, ...listItems]
    })
  ),
  on(
    LogsActions.loadNextPage,
    (state): LogsState => ({ ...state, currentPage: state.currentPage + 1 })
  )
);
