import { AuthActions } from './auth.actions';
import { authReducer, AuthState } from './auth.reducer';

// localStorage est mocké globalement dans jest.setup.ts
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

describe('AuthReducer', () => {
  describe('register', () => {
    it('should set loading=true and clear error', () => {
      // TODO: dispatch AuthActions.register, then expect loading=true, error=null
    });

    it('should set user, token and isAuthenticated=true on success', () => {
      // TODO: dispatch AuthActions.registerSuccess, then expect user/token/isAuthenticated
    });

    it('should set error and loading=false on failure', () => {
      // TODO: dispatch AuthActions.registerFailure({ error: 'message' }), then expect error set
    });
  });

  describe('login', () => {
    it('should set loading=true', () => {
      // TODO: dispatch AuthActions.login
    });

    it('should authenticate on success', () => {
      // TODO: dispatch AuthActions.loginSuccess, then expect isAuthenticated=true
    });

    it('should set error on failure', () => {
      // TODO: dispatch AuthActions.loginFailure
    });
  });

  describe('logout', () => {
    it('should reset state completely', () => {
      // TODO: partir d'un état authentifié, dispatch AuthActions.logout, then expect état vide
    });
  });

  describe('updateProfile', () => {
    it('should update user on success', () => {
      // TODO: dispatch AuthActions.updateProfileSuccess({ user }), then expect state.user mis à jour
    });

    it('should set error on failure', () => {
      // TODO: dispatch AuthActions.updateProfileFailure
    });
  });
});
