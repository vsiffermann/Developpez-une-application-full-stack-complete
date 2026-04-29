import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('mdd_token'),
  isAuthenticated: !!localStorage.getItem('mdd_token'),
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.register, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.registerSuccess, (state, { user, token }) => ({
      ...state, user, token, isAuthenticated: true, loading: false, error: null,
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
      ...state, user, token, isAuthenticated: true, loading: false, error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(AuthActions.logout, () => ({
      user: null, token: null, isAuthenticated: false, loading: false, error: null,
    })),
    on(AuthActions.loadUser, (state) => ({ ...state, loading: true })),
    on(AuthActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
    on(AuthActions.updateProfile, (state) => ({ ...state, loading: true, error: null })),
    on(AuthActions.updateProfileSuccess, (state, { user }) => ({
      ...state, user, loading: false, error: null,
    })),
    on(AuthActions.updateProfileFailure, (state, { error }) => ({ ...state, error, loading: false })),
  ),
});

export const authReducer = authFeature.reducer;
