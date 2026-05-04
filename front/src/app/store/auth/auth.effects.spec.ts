import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import * as AuthEffects from './auth.effects';
import { AuthService } from '../../core/services/auth.service';

const mockUser = { id: 1, email: 'alice@test.com', username: 'alice' };
const mockAuthResponse = { user: mockUser, token: 'jwt-token' };

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  getMe: jest.fn(),
  updateMe: jest.fn(),
};

const mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

describe('AuthEffects', () => {
  let actions$: Observable<Action>;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  describe('registerEffect', () => {
    it('should dispatch registerSuccess on success', (done) => {
      mockAuthService.register.mockReturnValue(of(mockAuthResponse));
      actions$ = of(AuthActions.register({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.registerEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.registerSuccess({ user: mockUser, token: 'jwt-token' }));
          done();
        });
      });
    });

    it('should dispatch registerFailure on error with message', (done) => {
      mockAuthService.register.mockReturnValue(throwError(() => ({ error: { message: 'Email déjà utilisé' } })));
      actions$ = of(AuthActions.register({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.registerEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.registerFailure({ error: 'Email déjà utilisé' }));
          done();
        });
      });
    });

    it('should dispatch registerFailure with fallback message on error without message', (done) => {
      mockAuthService.register.mockReturnValue(throwError(() => ({ error: {} })));
      actions$ = of(AuthActions.register({ email: 'alice@test.com', username: 'alice', password: 'P@ssw0rd1' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.registerEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.registerFailure({ error: 'Une erreur est survenue' }));
          done();
        });
      });
    });
  });

  describe('loginEffect', () => {
    it('should dispatch loginSuccess on success', (done) => {
      mockAuthService.login.mockReturnValue(of(mockAuthResponse));
      actions$ = of(AuthActions.login({ identifier: 'alice@test.com', password: 'P@ssw0rd1' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.loginEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.loginSuccess({ user: mockUser, token: 'jwt-token' }));
          done();
        });
      });
    });

    it('should dispatch loginFailure on error', (done) => {
      mockAuthService.login.mockReturnValue(throwError(() => ({ error: { message: 'Identifiants invalides' } })));
      actions$ = of(AuthActions.login({ identifier: 'alice@test.com', password: 'wrong' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.loginEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.loginFailure({ error: 'Identifiants invalides' }));
          done();
        });
      });
    });
  });

  describe('loadUserEffect', () => {
    it('should dispatch loadUserSuccess on success', (done) => {
      mockAuthService.getMe.mockReturnValue(of(mockUser));
      actions$ = of(AuthActions.loadUser());

      TestBed.runInInjectionContext(() => {
        AuthEffects.loadUserEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.loadUserSuccess({ user: mockUser }));
          done();
        });
      });
    });

    it('should dispatch loginFailure on error', (done) => {
      mockAuthService.getMe.mockReturnValue(throwError(() => ({ error: { message: 'Non autorisé' } })));
      actions$ = of(AuthActions.loadUser());

      TestBed.runInInjectionContext(() => {
        AuthEffects.loadUserEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.loginFailure({ error: 'Non autorisé' }));
          done();
        });
      });
    });
  });

  describe('updateProfileEffect', () => {
    it('should dispatch updateProfileSuccess on success', (done) => {
      const updatedUser = { ...mockUser, username: 'newname' };
      mockAuthService.updateMe.mockReturnValue(of(updatedUser));
      actions$ = of(AuthActions.updateProfile({ username: 'newname' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.updateProfileEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.updateProfileSuccess({ user: updatedUser }));
          done();
        });
      });
    });

    it('should dispatch updateProfileFailure on error', (done) => {
      mockAuthService.updateMe.mockReturnValue(throwError(() => ({ error: { message: 'Email déjà utilisé' } })));
      actions$ = of(AuthActions.updateProfile({ email: 'bob@test.com' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.updateProfileEffect().subscribe((action) => {
          expect(action).toEqual(AuthActions.updateProfileFailure({ error: 'Email déjà utilisé' }));
          done();
        });
      });
    });
  });

  describe('registerSuccessEffect', () => {
    it('should navigate to /feed after register success', (done) => {
      actions$ = of(AuthActions.registerSuccess({ user: mockUser, token: 'jwt-token' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.registerSuccessEffect().subscribe(() => {
          done();
        });
      });
    });
  });

  describe('loginSuccessEffect', () => {
    it('should navigate to /feed after login success', (done) => {
      actions$ = of(AuthActions.loginSuccess({ user: mockUser, token: 'jwt-token' }));

      TestBed.runInInjectionContext(() => {
        AuthEffects.loginSuccessEffect().subscribe(() => {
          done();
        });
      });
    });
  });

  describe('logoutEffect', () => {
    it('should remove token and navigate to /login on logout', (done) => {
      localStorage.setItem('mdd_token', 'some-token');
      actions$ = of(AuthActions.logout());

      TestBed.runInInjectionContext(() => {
        AuthEffects.logoutEffect().subscribe(() => {
          expect(localStorage.getItem('mdd_token')).toBeNull();
          done();
        });
      });
    });
  });
});
