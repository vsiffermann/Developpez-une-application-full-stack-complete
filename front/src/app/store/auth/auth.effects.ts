import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthService } from '../../core/services/auth.service';

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ identifier, password }) =>
        authService.login(identifier, password).pipe(
          tap(({ token }) => localStorage.setItem('mdd_token', token)),
          map(({ user, token }) => AuthActions.loginSuccess({ user, token })),
          catchError((error: Error) =>
            of(AuthActions.loginFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loginSuccessEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => router.navigate(['/feed'])),
    ),
  { functional: true, dispatch: false },
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('mdd_token');
        router.navigate(['/login']);
      }),
    ),
  { functional: true, dispatch: false },
);

export const loadUserEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) =>
    actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        authService.getMe().pipe(
          map((user) => AuthActions.loadUserSuccess({ user })),
          catchError((error: Error) =>
            of(AuthActions.loginFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
