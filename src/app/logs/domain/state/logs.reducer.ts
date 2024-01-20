import { createReducer, on } from "@ngrx/store";
import { actions as LogsActions } from "./logs.actions";

export interface LogsState {
  listItems: any[];
  filter: string[];
  loading: boolean;
};

export const featureKey = 'Logs'; 

const initialState: LogsState = {
  listItems: [],
  filter: [],
  loading: true,
};

export const logsReducer = createReducer(
  initialState,
  // on(LogsActions.loadLogsList, (state) => )
);
