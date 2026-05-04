import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { PostsActions } from './posts.actions';
import { Post, PostDetail } from '../../shared/models/post.model';
import { Comment } from '../../shared/models/comment.model';

const API_URL = '/api';

export const loadFeedEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.loadFeed),
      switchMap(({ sort }) =>
        http.get<Post[]>(`${API_URL}/posts/feed?sort=${sort}`).pipe(
          map((posts) => PostsActions.loadFeedSuccess({ posts })),
          catchError((error: Error) => of(PostsActions.loadFeedFailure({ error: error.message }))),
        ),
      ),
    ),
  { functional: true },
);

export const setSortOrderEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(PostsActions.setSortOrder),
      map(({ sort }) => PostsActions.loadFeed({ sort })),
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
          catchError((error: Error) => of(PostsActions.createPostFailure({ error: error.message }))),
        ),
      ),
    ),
  { functional: true },
);

export const createPostSuccessEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(PostsActions.createPostSuccess),
      tap(({ post }) => router.navigate(['/posts', post.id])),
    ),
  { functional: true, dispatch: false },
);

export const loadPostEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.loadPost),
      switchMap(({ id }) =>
        http.get<PostDetail>(`${API_URL}/posts/${id}`).pipe(
          map((post) => PostsActions.loadPostSuccess({ post })),
          catchError((error: Error) => of(PostsActions.loadPostFailure({ error: error.message }))),
        ),
      ),
    ),
  { functional: true },
);

export const addCommentEffect = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) =>
    actions$.pipe(
      ofType(PostsActions.addComment),
      switchMap(({ postId, content }) =>
        http.post<Comment>(`${API_URL}/posts/${postId}/comments`, { content }).pipe(
          map((comment) => PostsActions.addCommentSuccess({ comment })),
          catchError((error: Error) => of(PostsActions.addCommentFailure({ error: error.message }))),
        ),
      ),
    ),
  { functional: true },
);
