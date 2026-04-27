import { createFeature, createReducer, on } from '@ngrx/store';
import { Post } from '../../shared/models/post.model';
import { PostsActions } from './posts.actions';

export type SortOrder = 'asc' | 'desc';

export interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  sortOrder: SortOrder;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  sortOrder: 'desc',
};

export const postsFeature = createFeature({
  name: 'posts',
  reducer: createReducer(
    initialState,
    on(PostsActions.loadFeed, (state) => ({ ...state, loading: true, error: null })),
    on(PostsActions.loadFeedSuccess, (state, { posts }) => ({
      ...state,
      posts,
      loading: false,
    })),
    on(PostsActions.loadFeedFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(PostsActions.createPost, (state) => ({ ...state, loading: true })),
    on(PostsActions.createPostSuccess, (state, { post }) => ({
      ...state,
      posts: [post, ...state.posts],
      loading: false,
    })),
    on(PostsActions.loadPost, (state) => ({ ...state, loading: true, error: null })),
    on(PostsActions.loadPostSuccess, (state, { post }) => ({
      ...state,
      currentPost: post,
      loading: false,
    })),
  ),
});

export const postsReducer = postsFeature.reducer;
