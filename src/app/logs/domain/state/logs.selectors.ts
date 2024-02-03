import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LogsState, featureKey } from './logs.reducer';

const userSelectFeature = createFeatureSelector<LogsState>(featureKey);

const selectLogsFilter = createSelector(userSelectFeature, (state) => state.filter);
const selectLogsList = createSelector(userSelectFeature, (state) => state.listItems);
const selectCurrentLogsPage = createSelector(userSelectFeature, (state) => state.currentPage);
const selectIsLoading = createSelector(userSelectFeature, (state) => state.loading);

export const selectors = {
  selectLogsFilter,
  selectLogsList,
  selectCurrentLogsPage
};
