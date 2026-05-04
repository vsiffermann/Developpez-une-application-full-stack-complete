import { selectUser, selectToken, selectIsAuthenticated, selectAuthLoading, selectAuthError } from './auth.selectors';
import { AuthState } from './auth.reducer';

const mockUser = { id: 1, email: 'alice@test.com', username: 'alice' };

const state = (auth: Partial<AuthState>) => ({
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    ...auth,
  } as AuthState,
});

describe('AuthSelectors', () => {
  it('selectUser should return the user', () => {
    expect(selectUser(state({ user: mockUser }))).toEqual(mockUser);
  });

  it('selectToken should return the token', () => {
    expect(selectToken(state({ token: 'jwt-token' }))).toBe('jwt-token');
  });

  it('selectIsAuthenticated should return true when authenticated', () => {
    expect(selectIsAuthenticated(state({ isAuthenticated: true }))).toBe(true);
  });

  it('selectIsAuthenticated should return false by default', () => {
    expect(selectIsAuthenticated(state({}))).toBe(false);
  });

  it('selectAuthLoading should return loading state', () => {
    expect(selectAuthLoading(state({ loading: true }))).toBe(true);
  });

  it('selectAuthError should return the error', () => {
    expect(selectAuthError(state({ error: 'Erreur' }))).toBe('Erreur');
  });
});
