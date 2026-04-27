import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TopicsActions } from './topics.actions';
import { Topic } from '../../shared/models/topic.model';

const API_URL = 'http://localhost:8080/api';

export const loadTopicsEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(TopicsActions.loadTopics),
      switchMap(() =>
        http.get<Topic[]>(`${API_URL}/topics`).pipe(
          map((topics) => TopicsActions.loadTopicsSuccess({ topics })),
          catchError((error: Error) =>
            of(TopicsActions.loadTopicsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const subscribeEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(TopicsActions.subscribe),
      switchMap(({ id }) =>
        http.post<void>(`${API_URL}/topics/${id}/subscribe`, {}).pipe(
          map(() => TopicsActions.subscribeSuccess({ id })),
          catchError((error: Error) =>
            of(TopicsActions.loadTopicsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const unsubscribeEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(TopicsActions.unsubscribe),
      switchMap(({ id }) =>
        http.delete<void>(`${API_URL}/topics/${id}/subscribe`).pipe(
          map(() => TopicsActions.unsubscribeSuccess({ id })),
          catchError((error: Error) =>
            of(TopicsActions.loadTopicsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
