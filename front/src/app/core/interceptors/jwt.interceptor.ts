import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs';
import { selectToken } from '../../store/auth/auth.selectors';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectToken).pipe(
    first(),
    switchMap((token) => {
      if (!token) return next(req);

      return next(
        req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
      );
    }),
  );
};
