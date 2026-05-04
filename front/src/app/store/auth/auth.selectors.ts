import { authFeature } from './auth.reducer';

export const selectUser = authFeature.selectUser;
export const selectToken = authFeature.selectToken;
export const selectIsAuthenticated = authFeature.selectIsAuthenticated;
export const selectAuthLoading = authFeature.selectLoading;
export const selectAuthError = authFeature.selectError;
