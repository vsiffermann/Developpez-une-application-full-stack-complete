import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PostsActions } from './posts.actions';
import { Post } from '../../shared/models/post.model';

const API_URL = 'http://localhost:8080/api';

export const loadFeedEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.loadFeed),
      switchMap(() =>
        http.get<Post[]>(`${API_URL}/posts/feed`).pipe(
          map((posts) => PostsActions.loadFeedSuccess({ posts })),
          catchError((error: Error) =>
            of(PostsActions.loadFeedFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const createPostEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.createPost),
      switchMap(({ title, content, topicId }) =>
        http.post<Post>(`${API_URL}/posts`, { title, content, topicId }).pipe(
          map((post) => PostsActions.createPostSuccess({ post })),
          catchError((error: Error) =>
            of(PostsActions.loadFeedFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const loadPostEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.loadPost),
      switchMap(({ id }) =>
        http.get<Post>(`${API_URL}/posts/${id}`).pipe(
          map((post) => PostsActions.loadPostSuccess({ post })),
          catchError((error: Error) =>
            of(PostsActions.loadFeedFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  { functional: true },
);
