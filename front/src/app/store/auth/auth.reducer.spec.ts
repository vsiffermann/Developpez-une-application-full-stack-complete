import { AuthActions } from './auth.actions';
import { authReducer, AuthState } from './auth.reducer';

const mockUser = { id: 1, email: 'alice@test.com', username: 'alice' };

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
      const state = authReducer(
        { ...initialState, error: 'previous error' },
        AuthActions.register({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' })
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set user, token and isAuthenticated=true on success', () => {
      const state = authReducer(
        initialState,
        AuthActions.registerSuccess({ user: mockUser, token: 'jwt-token' })
      );
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('jwt-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should set error and loading=false on failure', () => {
      const state = authReducer(
        { ...initialState, loading: true },
        AuthActions.registerFailure({ error: 'Email déjà utilisé' })
      );
      expect(state.error).toBe('Email déjà utilisé');
      expect(state.loading).toBe(false);
    });
  });

  describe('login', () => {
    it('should set loading=true', () => {
      const state = authReducer(
        initialState,
        AuthActions.login({ identifier: 'alice@test.com', password: 'P@ssw0rd1' })
      );
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should authenticate on success', () => {
      const state = authReducer(
        initialState,
        AuthActions.loginSuccess({ user: mockUser, token: 'jwt-token' })
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('jwt-token');
    });

    it('should set error on failure', () => {
      const state = authReducer(
        { ...initialState, loading: true },
        AuthActions.loginFailure({ error: 'Identifiants invalides' })
      );
      expect(state.error).toBe('Identifiants invalides');
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should reset state completely', () => {
      const authenticatedState: AuthState = {
        user: mockUser,
        token: 'jwt-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      const state = authReducer(authenticatedState, AuthActions.logout());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user on success', () => {
      const updatedUser = { ...mockUser, username: 'newname' };
      const state = authReducer(
        { ...initialState, user: mockUser },
        AuthActions.updateProfileSuccess({ user: updatedUser })
      );
      expect(state.user).toEqual(updatedUser);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set error on failure', () => {
      const state = authReducer(
        { ...initialState, loading: true },
        AuthActions.updateProfileFailure({ error: 'Email déjà utilisé' })
      );
      expect(state.error).toBe('Email déjà utilisé');
      expect(state.loading).toBe(false);
    });
  });
});
