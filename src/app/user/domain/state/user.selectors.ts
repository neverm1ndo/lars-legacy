import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState, featureKey } from "./user.reducer";

const userSelectFeature = createFeatureSelector<UserState>(featureKey)

const selectUserSettings = createSelector(userSelectFeature, (state) => state.settings);
const selectUserProfile = createSelector(userSelectFeature, (state) => state.profile);
const selectIsAuthenticated = createSelector(userSelectFeature, (state) => state.isAuthenticated);

export const selectors = {
    selectUserSettings,
    selectUserProfile,
    selectIsAuthenticated,
};