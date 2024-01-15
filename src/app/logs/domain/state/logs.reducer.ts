import { createReducer, on } from "@ngrx/store";

const initialState = {
  listItems: [],
};

export const logsReducer = createReducer(initialState);
